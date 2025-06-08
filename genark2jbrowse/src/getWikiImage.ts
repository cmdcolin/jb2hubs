import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import slugify from 'slugify'

const all = JSON.parse(
  fs.readFileSync('processedHubJson/all.json', 'utf8'),
) as ({ accession: string; scientificName: string } | null)[]

fs.mkdirSync('speciesDescriptions', { recursive: true })
fs.mkdirSync('downloads', { recursive: true })

let i = 0
for (const entry of all.filter(f => !!f)) {
  const { scientificName } = entry

  if (
    !fs.existsSync(path.join('speciesImages', slugify(scientificName) + '.txt'))
  ) {
    try {
      console.log(`Processing ${i++}/${all.length}: ${scientificName}`)
      const command = `python3 wiki_image_downloader.py --size 300 "${scientificName}"`
      execSync(command, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      })

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (e) {
      console.error(e)
    }
  } else {
    console.log('Already found ', scientificName)
  }
}
