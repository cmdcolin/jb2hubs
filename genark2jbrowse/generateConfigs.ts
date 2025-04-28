import fs from 'node:fs'

import deepEqual from 'fast-deep-equal'

import {
  generateJBrowseConfigForAssemblyHub,
  readJSON,
  writeJSON,
} from 'hubtools'

const metaPath = process.argv[2]!
const configPath = metaPath.replace('meta.json', 'config.json')
const hubMeta = readJSON(metaPath) as {
  hubFileLocation: string
}
let oldConfig
try {
  oldConfig = readJSON(configPath)
} catch {}

const hubFileText = fs.readFileSync(
  metaPath.replace('meta.json', 'hub.txt'),
  'utf8',
)

const newConfig = generateJBrowseConfigForAssemblyHub({
  hubFileText,
  trackDbUrl: hubMeta.hubFileLocation,
})

if (deepEqual(newConfig, oldConfig)) {
  console.error('No config generated')
} else {
  writeJSON(configPath, newConfig)
}
