import fs from 'node:fs'

import { hubCategories } from './hubCategories.ts'
import { myfetchtext } from './util.ts'

for (const { id } of hubCategories) {
  fs.writeFileSync(
    `website/hubJson/${id}.json`,
    await myfetchtext(
      `https://hgdownload.soe.ucsc.edu/hubs/${id}/assemblyList.json`,
    ),
  )
}
