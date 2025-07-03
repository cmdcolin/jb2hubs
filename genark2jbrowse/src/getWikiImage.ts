import { execSync } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'

import slugify from 'slugify'

import { readJSON } from './util.ts'

interface SpeciesEntry {
  accession: string
  scientificName: string
}

/**
 * Downloads a Wikipedia image for each species and saves it locally.
 * It uses a Python script `wiki_image_downloader.py` for the actual download.
 */
async function downloadWikiImages() {
  fs.mkdirSync('speciesDescriptions', { recursive: true })
  fs.mkdirSync('downloads', { recursive: true })

  const allProcessedEntries = (
    await readJSON<(SpeciesEntry | null)[]>('processedHubJson/all.json')
  ).filter((entry): entry is SpeciesEntry => !!entry)

  let processedCount = 0
  for (const entry of allProcessedEntries) {
    const { scientificName } = entry
    const imageFileName = `${slugify(scientificName)}.txt` // Assuming the Python script outputs a .txt file with image info
    const imageFilePath = path.join('speciesImages', imageFileName)

    // Check if the image file already exists
    if (!fs.existsSync(imageFilePath)) {
      try {
        console.log(
          `Downloading image for ${scientificName} (${++processedCount}/${allProcessedEntries.length})`,
        )
        // Execute the Python script to download the image
        const command = `python3 wiki_image_downloader.py --size 300 "${scientificName}"`
        execSync(command, {
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'pipe'], // Capture stdout, stderr
        })

        // Add a small delay to avoid rate limiting Wikipedia's API
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        console.error(`Error downloading image for ${scientificName}: ${error}`)
      }
    } else {
      console.log(`Image already found for ${scientificName}.`)
    }
  }
}

downloadWikiImages().catch(console.error)
