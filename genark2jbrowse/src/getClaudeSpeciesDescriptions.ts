import fs from 'fs'
import { execSync } from 'child_process'

const model = 'claude-3-haiku'
const all = JSON.parse(
  fs.readFileSync('processedHubJson/all.json', 'utf8'),
) as { accession: string; scientificName: string }[]

let i = 0
for (const entry of all) {
  const { scientificName, accession } = entry
  const [base, rest] = accession.split('_')
  const [b1, b2, b3] = rest!.match(/.{1,3}/g)!
  const f = `hubs/${base}/${b1}/${b2}/${b3}/${accession}/aidesc.json`
  console.log(`Processing ${scientificName} (${i++}/${all.length})`)
  if (!fs.existsSync(f)) {
    const description = execSync(
      `echo "Provide a small description of this species, with notes about general and/or scientific interest: ${scientificName}" | llm -m ${model}`,
      { encoding: 'utf8' },
    ).trim()
    fs.writeFileSync(
      f,
      JSON.stringify(
        {
          description,
          model,
          dateGenerated: +new Date(),
        },
        null,
        2,
      ),
    )
  }
}
