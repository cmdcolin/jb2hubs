import fs from 'node:fs'
import { generateJBrowseConfigForAssemblyHub } from './generateJBrowseConfigForAssemblyHub.ts'

const meta = process.argv[2]
const hubMeta = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
const hubFileText = fs.readFileSync(
  meta.replace('meta.json', 'hub.txt'),
  'utf8',
)

const config = generateJBrowseConfigForAssemblyHub({
  hubFileText,
  trackDbUrl: hubMeta.hubFileLocation,
})

if (config) {
  fs.writeFileSync(
    meta.replace('meta.json', 'config.json'),
    JSON.stringify(config, null, 2),
  )
} else {
  console.error('No config generated')
}
