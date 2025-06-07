import fs from 'fs'
import { execSync } from 'child_process'
import path from 'path'

// File path for species descriptions
const speciesDescriptionsPath =
  'website/processedHubJson/speciesDescriptions.json'

// Read all species from the all.json file
const all = JSON.parse(
  fs.readFileSync('website/processedHubJson/all.json', 'utf8'),
) as { scientificName: string }[]

// Get unique scientific names
const scientificNames = [...new Set(all.map(a => a.scientificName))]

// Initialize existing descriptions object
let existingDescriptions: Record<string, string> = {}

// Check if the speciesDescriptions.json file exists and read it
if (fs.existsSync(speciesDescriptionsPath)) {
  existingDescriptions = JSON.parse(
    fs.readFileSync(speciesDescriptionsPath, 'utf8'),
  )
  console.log(
    `Loaded ${Object.keys(existingDescriptions).length} existing species descriptions`,
  )
} else {
  console.log(
    'No existing species descriptions file found. Creating a new one.',
  )
}

// Filter out scientific names that already have descriptions
const newScientificNames = scientificNames.filter(
  name => !existingDescriptions[name],
)

console.log(
  `Found ${newScientificNames.length} new species that need descriptions`,
)

// Get descriptions for new scientific names
const newEntries: Record<string, string> = {}
for (const scientificName of newScientificNames) {
  console.log(`Getting description for: ${scientificName}`)
  try {
    // Launch a shell command and store the result in the aiDescription variable
    const aiDescription = execSync(
      `echo "Provide a small description of this scientific species: ${scientificName}" | llm -m claude-4-opus`,
      { encoding: 'utf8' },
    ).trim()
    newEntries[scientificName] = aiDescription
  } catch (error) {
    console.error(`Error getting description for ${scientificName}:`, error)
    // Skip this entry if there was an error
  }
}

// Merge existing and new descriptions
const allDescriptions = { ...existingDescriptions, ...newEntries }

// Write the updated descriptions to the file
fs.writeFileSync(
  speciesDescriptionsPath,
  JSON.stringify(allDescriptions, null, 2),
)

console.log(
  `Successfully wrote ${Object.keys(allDescriptions).length} species descriptions to file`,
)
console.log(`Added ${Object.keys(newEntries).length} new descriptions`)
