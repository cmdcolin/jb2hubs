import fs from 'node:fs'
import { myfetchtext, readJSON } from './util.ts'

const ret = readJSON(process.argv[2]) as { id: string }[]
for (const { id } of ret) {
  fs.writeFileSync(
    `hubJson/${id}.json`,
    await myfetchtext(
      `https://hgdownload.soe.ucsc.edu/hubs/${id}/assemblyList.json`,
    ),
  )
}
