const stream = require('stream')
const { streamifyResponse } = require('awslambda')

exports.handler = streamifyResponse(async (event, responseStream, context) => {
  const file = event.queryStringParameters.file
  if (!file) {
    responseStream.write(
      JSON.stringify({ message: 'Missing required query parameter: file' }),
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

    // Set the content type of the response
    responseStream.setContentType('application/json')

    // Pipe the response body to the lambda response stream
    await stream.promises.pipeline(fetchResponse.body, responseStream)
  } catch (error) {
    responseStream.write(
      JSON.stringify({ message: `Error fetching file: ${error.message}` }),
    )
    responseStream.end()
  }
})
