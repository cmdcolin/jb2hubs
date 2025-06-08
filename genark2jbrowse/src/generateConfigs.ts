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
  oldConfig = readJSON(configPath) as Record<string, unknown>
} catch {
  oldConfig = {} as Record<string, unknown>
}

const hubFileText = fs.readFileSync(
  metaPath.replace('meta.json', 'hub.txt'),
  'utf8',
)

const newConfig = await generateJBrowseConfigForAssemblyHub({
  hubFileText,
  trackDbUrl: hubMeta.hubFileLocation,
})

if (deepEqual(newConfig, oldConfig)) {
  console.error('Old config equals new one')
} else {
  // this branch currently runs every time, which results in text indexing
  // running every time
  writeJSON(configPath, newConfig)
}
