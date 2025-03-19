import { dedupe } from '@jbrowse/core/util/index.js'
import fs from 'node:fs'
import path from 'node:path'

const ret = fs.readdirSync('extensions')
for (const item of ret) {
  const accession = item.replace('.json', '')
  const [base, rest] = accession.split('_')
  const [b1, b2, b3] = rest.match(/.{1,3}/g)!
  const f = `hubs/${base}/${b1}/${b2}/${b3}/${accession}/config.json`

  // Create directory structure if it doesn't exist
  const dir = path.dirname(f)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }

  // Create backup of existing config file
  fs.copyFileSync(f, `${f}.bak`)
  console.log(`Created backup: ${f}.bak`)

  // Read the existing config file
  const existingConfig = JSON.parse(fs.readFileSync(f, 'utf8'))

  // Read the extension file
  const extensionConfig = JSON.parse(
    fs.readFileSync(path.join('extensions', item), 'utf8'),
  )

  // Merge the configs (extension takes precedence)
  const mergedConfig = {
    ...existingConfig,
    ...extensionConfig,
    tracks: dedupe(
      [...existingConfig.tracks, ...extensionConfig.tracks],
      t => t.trackId,
    ),
  }

  // Write the merged config back to the original file
  fs.writeFileSync(f, JSON.stringify(mergedConfig, null, 2))
  console.log(`Updated config file: ${f}`)
}
