import fs from 'node:fs'
import { generateJBrowseConfigForAssemblyHub } from './generateJBrowseConfigForAssemblyHub.ts'
import { readJSON, writeJSON } from './util.ts'

const meta = process.argv[2]
const hubMeta = readJSON(process.argv[2]) as { hubFileLocation: string }
const hubFileText = fs.readFileSync(
  meta.replace('meta.json', 'hub.txt'),
  'utf8',
)

const config = generateJBrowseConfigForAssemblyHub({
  hubFileText,
  trackDbUrl: hubMeta.hubFileLocation,
})

if (config) {
  writeJSON(meta.replace('meta.json', 'config.json'), config)
} else {
  console.error('No config generated')
}
