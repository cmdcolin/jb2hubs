import fs from 'fs'
import path from 'path'

import { parseAssemblyEntry, readJSON } from './util.ts'
import { APIData } from './types'

let entries = [] as APIData[]
for (const entry of process.argv.slice(2)) {
  const source = path.basename(entry, '.json')
  if (source !== 'all') {
    entries = entries.concat(
      (readJSON(entry) as { data: APIData[] }).data.map(t => ({
        ...t,
        source,
      })),
    )
  }
}

for (const entry of process.argv.slice(2)) {
  const source = path.basename(entry, '.json')
  if (source !== 'all') {
    fs.writeFileSync(
      'hubJson2/' + source + '.json',
      JSON.stringify(
        (readJSON(entry) as { data: APIData[] }).data.map(r =>
          parseAssemblyEntry(r),
        ),
        null,
        2,
      ),
    )
  }
}

fs.writeFileSync(
  'hubJson2/all.json',
  JSON.stringify(
    entries.map(r => parseAssemblyEntry(r)),
    null,
    2,
  ),
)
