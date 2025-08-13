const stream = require('stream')
const { streamifyResponse } = require('awslambda')

async function handleList(event, responseStream) {
  const file = event.queryStringParameters.list
  if (!file) {
    responseStream.write(
      JSON.stringify({ message: 'Missing required query parameter: list' }),
    )
    responseStream.end()
    return
  }

  const url = `https://genomes.jbrowse.org/processedHubJson/${file}`

  try {
    const fetchResponse = await fetch(url)

    if (!fetchResponse.ok) {
      responseStream.statusCode = fetchResponse.status
      responseStream.write(
        JSON.stringify({
          message: `Failed to fetch file: ${fetchResponse.statusText}`,
        }),
      )
      responseStream.end()
      return
    }

    responseStream.setContentType('application/json')
    await stream.promises.pipeline(fetchResponse.body, responseStream)
  } catch (error) {
    responseStream.write(
      JSON.stringify({ message: `Error fetching file: ${error.message}` }),
    )
    responseStream.end()
  }
}

async function handleDb(event, responseStream) {
  const accession = event.queryStringParameters.db
  if (!accession) {
    responseStream.statusCode = 400
    responseStream.write(
      JSON.stringify({
        message: 'Missing required query parameter: db',
      }),
    )
    responseStream.end()
    return
  }

  let url
  if (accession.startsWith('GCA') || accession.startsWith('GCF')) {
    const [base, rest] = accession.split('_')
    const [b1, b2, b3] = rest.match(/.{1,3}/g)
    const filename = `hubs/${base}/${b1}/${b2}/${b3}/${accession}/config.json`
    url = `https://genomes.jbrowse.org/${filename}`
  } else {
    url = `https://genomes.jbrowse.org/ucsc/${accession}/config.json`
  }

  try {
    const fetchResponse = await fetch(url)

    if (!fetchResponse.ok) {
      responseStream.statusCode = fetchResponse.status
      responseStream.write(
        JSON.stringify({
          message: `Failed to fetch file: ${fetchResponse.statusText}`,
        }),
      )
      responseStream.end()
      return
    }

    responseStream.setContentType('application/json')
    await stream.promises.pipeline(fetchResponse.body, responseStream)
  } catch (error) {
    responseStream.statusCode = 500
    responseStream.write(
      JSON.stringify({ message: `Error fetching file: ${error.message}` }),
    )
    responseStream.end()
  }
}

exports.handler = streamifyResponse(async (event, responseStream, context) => {
  if (event.queryStringParameters && event.queryStringParameters.list) {
    await handleList(event, responseStream)
  } else if (event.queryStringParameters && event.queryStringParameters.db) {
    await handleDb(event, responseStream)
  } else {
    responseStream.statusCode = 400
    responseStream.write(
      JSON.stringify({
        message: 'Missing required query parameter: list or db',
      }),
    )
    responseStream.end()
  }
})
