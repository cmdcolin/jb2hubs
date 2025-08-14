// The 'aws-lambda' types package does not yet include streamifyResponse,
// so we declare it manually. It is available in the Lambda runtime.
declare const awslambda: {
  streamifyResponse(
    handler: (event: any, responseStream: any, context: any) => Promise<void>,
  ): any
  HttpResponseStream: {
    from(responseStream: any, metadata: any): any
  }
}

interface QueryStringParameters {
  list?: string
  db?: string
}

function getUrl(event: {
  queryStringParameters?: QueryStringParameters
}): string | null {
  const listFile = event.queryStringParameters?.list
  if (listFile) {
    return `https://jbrowse.org/processedHubJson/${listFile}`
  }

  const accession = event.queryStringParameters?.db
  if (accession) {
    if (accession.startsWith('GCA') || accession.startsWith('GCF')) {
      const [base, rest] = accession.split('_')
      const matches = rest.match(/.{1,3}/g)
      if (!matches || matches.length < 3) {
        return null // Invalid accession format
      }
      const [b1, b2, b3] = matches
      return `https://jbrowse.org/hubs/${base}/${b1}/${b2}/${b3}/${accession}/config.json`
    } else {
      return `https://jbrowse.org/ucsc/${accession}/config.json`
    }
  }
  return null
}

export const handler = awslambda.streamifyResponse(
  async (event: any, responseStream: any, context: any) => {
    console.log('Lambda invoked with event:', JSON.stringify(event))

    const url = getUrl(event)

    if (!url) {
      console.log('Could not determine URL from query parameters')
      responseStream.setContentType('application/json')
      responseStream.write(
        JSON.stringify({
          message: 'Missing or invalid query parameter: use "list" or "db"',
        }),
      )
      responseStream.end()
      return
    }

    console.log(`Fetching from URL: ${url}`)

    try {
      const fetchResponse = await fetch(url)
      console.log(`Fetch response status: ${fetchResponse.status}`)

      if (!fetchResponse.ok) {
        console.log('Fetch was not successful, writing error response.')
        const metadata = {
          statusCode: fetchResponse.status,
          headers: { 'Content-Type': 'application/json' },
        }
        const httpResponseStream = awslambda.HttpResponseStream.from(
          responseStream,
          metadata,
        )
        const body = await fetchResponse.text()
        console.log(`Error body: ${body}`)
        httpResponseStream.write(
          JSON.stringify({
            message: `Failed to fetch file: ${fetchResponse.statusText}`,
            body,
          }),
        )
        httpResponseStream.end()
        return
      }

      const metadata = {
        statusCode: 200,
        headers: {
          'Content-Type':
            fetchResponse.headers.get('Content-Type') || 'application/json',
          'Content-Length': fetchResponse.headers.get('Content-Length'),
        },
      }
      const httpResponseStream = awslambda.HttpResponseStream.from(
        responseStream,
        metadata,
      )

      console.log('Starting native web stream read...')
      // Using the native web stream reader to bypass Node.js stream adapters
      // @ts-expect-error
      const reader = fetchResponse.body.getReader()
      while (true) {
        const { done, value } = await reader.read()
        if (done) {
          break
        }
        httpResponseStream.write(value)
      }
      httpResponseStream.end()
      console.log('Native web stream read finished successfully.')
    } catch (error) {
      console.error('Error during fetch or streaming:', error)
      const metadata = {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
      }
      const httpResponseStream = awslambda.HttpResponseStream.from(
        responseStream,
        metadata,
      )
      httpResponseStream.write(
        JSON.stringify({
          message: `Error fetching file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        }),
      )
      httpResponseStream.end()
    }
  },
)
