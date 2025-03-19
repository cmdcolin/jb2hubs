import fs from 'fs'
import { generateConfigFromHub } from './generateConfigFromHub'

const meta = process.argv[2]
const hubMeta = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const hubFileText = fs.readFileSync(meta.replace('.meta.json', '.txt'), 'utf8')

console.log(
  JSON.stringify(
    generateConfigFromHub({
      hubFileText,
      hubFileLocation: {
        uri: hubMeta.hubFileLocation,
        baseUri: 'http://localhost',
        locationType: 'UriLocation',
      },
    }),
    null,
    2,
  ),
)
