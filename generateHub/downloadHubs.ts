import fs from 'node:fs'
import { myfetchtext } from './util.ts'
import { hubCategories } from './hubCategories.ts'

for (const { id } of hubCategories) {
  fs.writeFileSync(
    `hubJson/${id}.json`,
    await myfetchtext(
      `https://hgdownload.soe.ucsc.edu/hubs/${id}/assemblyList.json`,
    ),
  )
}
