const stream = require('stream')
const { streamifyResponse } = require('awslambda')

exports.handler = streamifyResponse(async (event, responseStream, context) => {
  const accession = event.queryStringParameters.accession
  if (!accession) {
    responseStream.statusCode = 400
    responseStream.write(
      JSON.stringify({
        message: 'Missing required query parameter: accession',
      }),
    )
    responseStream.end()
    return
  }

  const [base, rest] = accession.split('_')
  const [b1, b2, b3] = rest.match(/.{1,3}/g)
  const filename = `hubs/${base}/${b1}/${b2}/${b3}/${accession}/config.json`
  const url = `https://genomes.jbrowse.org/${filename}`

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
})
