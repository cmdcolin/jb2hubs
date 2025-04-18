import fs from 'node:fs'

import { generateJBrowseConfigForAssemblyHub } from './generateJBrowseConfigForAssemblyHub.ts'
import { readJSON, writeJSON } from './util.ts'
import deepEqual from 'fast-deep-equal'

const metaPath = process.argv[2]
const configPath = metaPath.replace('meta.json', 'config.json')
const hubMeta = readJSON(metaPath) as {
  hubFileLocation: string
}
let oldConfig
try {
  oldConfig = readJSON(configPath)
} catch (e) {}

const hubFileText = fs.readFileSync(
  metaPath.replace('meta.json', 'hub.txt'),
  'utf8',
)

const newConfig = generateJBrowseConfigForAssemblyHub({
  hubFileText,
  trackDbUrl: hubMeta.hubFileLocation,
})

if (!deepEqual(newConfig, oldConfig)) {
  writeJSON(configPath, newConfig)
} else {
  console.error('No config generated')
}
