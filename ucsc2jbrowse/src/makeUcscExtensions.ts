import fs from 'node:fs'
import path from 'node:path'

import { dedupe } from './dedupe.ts'
import { JBrowseConfig } from './types.ts'
import { readConfig, writeJSON } from './util.ts'

const BASE_EXTENSION_DIR = 'ucscExtensions'

/**
 * Integrates UCSC extension configurations into existing JBrowse configurations.
 * It reads JSON files from the 'ucscExtensions' directory, merges them with
 * the corresponding assembly's config.json, and writes the updated config.
 * @param targetDir The root directory where assembly configurations are located (e.g., '~/ucscResults').
 */
function makeUcscExtensions(targetDir: string) {
  const extensionFiles = fs.readdirSync(BASE_EXTENSION_DIR)

  for (const item of extensionFiles) {
    const accession = item.replace('.json', '')
    const configFilePath = path.join(targetDir, accession, 'config.json')

    // Ensure directory structure exists for the target config file
    const dir = path.dirname(configFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    let existingConfig: JBrowseConfig
    try {
      existingConfig = readConfig(configFilePath)
    } catch (e) {
      console.warn(
        `Could not read existing config for ${accession}. Creating a new one.`,
      )
      existingConfig = { assemblies: [], tracks: [] }
    }

    const extensionConfig = readConfig(path.join(BASE_EXTENSION_DIR, item))

    // Merge existing and extension configurations
    const mergedConfig: JBrowseConfig = {
      ...existingConfig,
      ...extensionConfig,
      tracks: dedupe(
        [...extensionConfig.tracks, ...existingConfig.tracks],
        track => track.trackId,
      ),
      // Merge plugins if they exist
      plugins: dedupe(
        [...extensionConfig.plugins, ...existingConfig.plugins],
        plugin => (plugin as { name: string }).name, // Assuming plugins have a 'name' property
      ),
      // Merge aggregateTextSearchAdapters if they exist
      aggregateTextSearchAdapters: dedupe(
        [
          ...extensionConfig.aggregateTextSearchAdapters,
          ...existingConfig.aggregateTextSearchAdapters,
        ],
        adapter =>
          (adapter as { textSearchAdapterId: string }).textSearchAdapterId, // Assuming adapters have a 'textSearchAdapterId' property
      ),
    }

    writeJSON(configFilePath, mergedConfig)
    console.log(`Updated config file: ${configFilePath}`)
  }
}

if (require.main === module) {
  if (process.argv.length !== 3) {
    console.error('Usage: ts-node makeUcscExtensions.ts <targetDirectory>')
    process.exit(1)
  }

  makeUcscExtensions(process.argv[2])
}
