import * as fs from 'fs'

import { hubCategories, myfetchtext } from 'hubtools'

// Downloads the list of assembly hubs from UCSC and saves them as JSON files
// in the ../website/hubJson directory.
for (const { id } of hubCategories) {
  fs.writeFileSync(
    `../website/hubJson/${id}.json`,
    await myfetchtext(
      `https://hgdownload.soe.ucsc.edu/hubs/${id}/assemblyList.json`,
    ),
  )
}
