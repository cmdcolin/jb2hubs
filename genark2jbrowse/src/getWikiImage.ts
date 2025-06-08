import { execSync } from 'child_process'
import fs from 'fs'

const all = JSON.parse(
  fs.readFileSync('processedHubJson/all.json', 'utf8'),
) as ({ accession: string; scientificName: string } | null)[]

fs.mkdirSync('speciesDescriptions', { recursive: true })
fs.mkdirSync('downloads', { recursive: true })

let i = 0
for (const entry of all.filter(f => !!f).slice(0, 10)) {
  try {
    const { scientificName } = entry

    console.log(`Processing ${i++}/${all.length}: ${scientificName}`)

    // Call the Python script to download the image
    try {
      const command = `python3 wiki_image_downloader.py --size 300 "${scientificName}"`
      console.log(`Executing: ${command}`)
      execSync(command, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
      })
    } catch (err) {
      console.error(`Error downloading image for ${scientificName}:`, err)
    }

    // Add a small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (e) {
    console.error(e)
  }
}
