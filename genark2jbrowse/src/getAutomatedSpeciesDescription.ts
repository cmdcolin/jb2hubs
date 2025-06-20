import { execSync } from 'child_process'
import fs from 'fs'

import slugify from 'slugify'

import { readJSON } from './util.ts'

const model = 'claude-3-haiku'

interface Entry {
  accession: string
  scientificName: string
}
type MaybeEntry = Entry | null

fs.mkdirSync('speciesDescriptions', { recursive: true })
let i = 0
for (const entry of (
  await readJSON<MaybeEntry[]>('processedHubJson/all.json')
).filter(f => !!f)) {
  try {
    const { scientificName, accession } = entry
    const [base, rest] = accession.split('_')
    const [b1, b2, b3] = rest!.match(/.{1,3}/g)!
    const f = `hubs/${base}/${b1}/${b2}/${b3}/${accession}/description.json`
    const f2 = `speciesDescriptions/${slugify(scientificName)}.json`

    if (!fs.existsSync(f)) {
      if (!fs.existsSync(f2)) {
        console.log(
          `Processing ${scientificName} ${accession} (${i++}/${(await readJSON<MaybeEntry[]>('processedHubJson/all.json')).length})`,
        )
        const description = execSync(
          `echo "Provide a short scientific description of this species: ${scientificName}" | llm -m ${model}`,
          { encoding: 'utf8' },
        ).trim()
        const obj = JSON.stringify(
          {
            description,
            model,
            prompt: 'Provide a short scientific description of this species',
            dateGenerated: +new Date(),
          },
          null,
          2,
        )
        fs.writeFileSync(f, obj)
        fs.writeFileSync(f2, obj)
      } else {
        fs.copyFileSync(f2, f)
      }
    } else {
      console.log('Already exists: ', scientificName)
    }
  } catch (e) {
    console.error(e)
  }
}
