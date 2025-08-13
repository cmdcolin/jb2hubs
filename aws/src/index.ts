import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda'

interface APIGatewayProxyEventWithQuery extends APIGatewayProxyEvent {
  queryStringParameters: {
    [key: string]: string
  } | null
}

async function handleList(
  event: APIGatewayProxyEventWithQuery,
): Promise<APIGatewayProxyResult> {
  const file = event.queryStringParameters?.list
  if (!file) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Missing required query parameter: list',
      }),
    }
  }
  console.log(file)

  const url = `https://jbrowse.org/processedHubJson/${file}`

  try {
    const fetchResponse = await fetch(url)

    if (!fetchResponse.ok) {
      return {
        statusCode: fetchResponse.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Failed to fetch file: ${fetchResponse.statusText}`,
        }),
      }
    }

    const data = await fetchResponse.text()
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: data,
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Error fetching file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }),
    }
  }
}

async function handleDb(
  event: APIGatewayProxyEventWithQuery,
): Promise<APIGatewayProxyResult> {
  const accession = event.queryStringParameters?.db
  console.log(accession)
  if (!accession) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Missing required query parameter: db',
      }),
    }
  }

  let url: string
  if (accession.startsWith('GCA') || accession.startsWith('GCF')) {
    const [base, rest] = accession.split('_')
    const matches = rest.match(/.{1,3}/g)
    if (!matches || matches.length < 3) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'Invalid accession format',
        }),
      }
    }
    const [b1, b2, b3] = matches
    url = `https://jbrowse.org/${`hubs/${base}/${b1}/${b2}/${b3}/${accession}/config.json`}`
  } else {
    url = `https://jbrowse.org/ucsc/${accession}/config.json`
  }

  try {
    const fetchResponse = await fetch(url)

    if (!fetchResponse.ok) {
      return {
        statusCode: fetchResponse.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Failed to fetch file: ${fetchResponse.statusText}`,
        }),
      }
    }

    const data = await fetchResponse.text()
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: data,
    }
  } catch (error) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Error fetching file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }),
    }
  }
}

export const handler = async (
  event: APIGatewayProxyEventWithQuery,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  console.log('HERE')
  if (event.queryStringParameters?.list) {
    console.log('HERE1')
    return await handleList(event)
  } else if (event.queryStringParameters?.db) {
    console.log('HERE2')
    return await handleDb(event)
  } else {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Missing required query parameter: list or db',
      }),
    }
  }
}
