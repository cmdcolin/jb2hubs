import fs from 'fs'
import { execSync } from 'child_process'

const all = JSON.parse(
  fs.readFileSync('website/processedHubJson/all.json', 'utf8'),
) as { scientificName: string }[]

const scientificNames = [...new Set(all.map(a => a.scientificName))]

const newEntries = Object.fromEntries(
  scientificNames.map(scientificName => {
    // Launch a shell command and store the result in the aiDescription variable
    const aiDescription = execSync(
      `echo "Provide a small description of this scientific species: ${scientificName}" | llm -m claude-4-opus`,
      { encoding: 'utf8' },
    ).trim()
    return [scientificName, aiDescription]
  }),
)

fs.writeFileSync(
  'website/processedHubJson/speciesDescriptions.json',
  JSON.stringify(newEntries, null, 2),
)
