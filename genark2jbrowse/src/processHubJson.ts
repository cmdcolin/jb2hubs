import fs from 'fs'
import path from 'path'

import { type UCSCGenArkAssemblyEntry, parseAssemblyEntry } from 'hubtools'

import { readJSON } from './util.ts'

let entries = [] as UCSCGenArkAssemblyEntry[]
const files = fs.readdirSync('hubJson').map(f => path.join('hubJson', f))
for (const file of files) {
  const source = path.basename(file, '.json')
  if (source !== 'all') {
    entries = entries.concat(
      (await readJSON<{ data: UCSCGenArkAssemblyEntry[] }>(file)).data.map(
        t => ({
          ...t,
          source,
        }),
      ),
    )
  }
}

for (const file of files) {
  const source = path.basename(file, '.json')
  if (source !== 'all') {
    fs.writeFileSync(
      'processedHubJson/' + source + '.json',
      JSON.stringify(
        (await readJSON<{ data: UCSCGenArkAssemblyEntry[] }>(file)).data.map(
          entry => parseAssemblyEntry({ entry }),
        ),
        null,
        2,
      ),
    )
  }
}

fs.writeFileSync(
  'processedHubJson/all.json',
  JSON.stringify(
    entries.map(entry => parseAssemblyEntry({ entry })),
    null,
    2,
  ),
)
