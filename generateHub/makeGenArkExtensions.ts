import fs from 'node:fs'
import path from 'node:path'

import { dedupe } from './dedupe.ts'
import { readJSON } from './util.ts'

interface Config {
  tracks: {
    trackId: string
  }[]
}
const b = 'genArkExtensions'
const ret = fs.readdirSync(b)
for (const item of ret) {
  const accession = item.replace('.json', '')
  const [base, rest] = accession.split('_')
  const [b1, b2, b3] = rest!.match(/.{1,3}/g)!
  const f = `hubs/${base}/${b1}/${b2}/${b3}/${accession}/config.json`

  // Create directory structure if it doesn't exist
  const dir = path.dirname(f)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    })
  }

  // Create backup of existing config file
  fs.copyFileSync(f, `${f}.bak`)
  console.log(`Created backup: ${f}.bak`)

  const existingConfig = readJSON(f) as Config
  const extensionConfig = readJSON(path.join(b, item)) as Config

  // Merge the configs (extension takes precedence)
  const mergedConfig = {
    ...existingConfig,
    ...extensionConfig,
    tracks: dedupe(
      [...extensionConfig.tracks, ...existingConfig.tracks],
      t => t.trackId,
    ),
  }

  // Write the merged config back to the original file
  fs.writeFileSync(f, JSON.stringify(mergedConfig, undefined, 2))
  console.log(`Updated config file: ${f}`)
}
