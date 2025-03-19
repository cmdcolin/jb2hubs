import fs from 'fs'
import { generateConfigFromHub } from './generateConfigFromHub.ts'

const meta = process.argv[2]
const hubMeta = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const hubFileText = fs.readFileSync(meta.replace('meta.txt', 'hub.txt'), 'utf8')
const config = generateConfigFromHub({
  hubFileText,
  hubFileLocation: {
    uri: hubMeta.hubFileLocation,
    baseUri: 'http://localhost',
    locationType: 'UriLocation',
  },
})

if (config) {
  fs.writeFileSync(
    meta.replace('meta.txt', 'config.json'),
    JSON.stringify(config, null, 2),
  )
} else {
  console.error('No config generated')
}
