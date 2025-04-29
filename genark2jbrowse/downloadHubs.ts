import fs from 'node:fs'

import { hubCategories, myfetchtext } from '@gmod/bam'

for (const { id } of hubCategories) {
  fs.writeFileSync(
    `../website/hubJson/${id}.json`,
    await myfetchtext(
      `https://hgdownload.soe.ucsc.edu/hubs/${id}/assemblyList.json`,
    ),
  )
}
