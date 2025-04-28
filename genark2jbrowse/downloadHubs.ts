import { hubCategories, myfetchtext } from 'hubtools'
import fs from 'node:fs'

for (const { id } of hubCategories) {
  fs.writeFileSync(
    `../website/hubJson/${id}.json`,
    await myfetchtext(
      `https://hgdownload.soe.ucsc.edu/hubs/${id}/assemblyList.json`,
    ),
  )
}
