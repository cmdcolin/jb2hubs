import fs from 'fs'

import { generateJBrowseConfigForAssemblyHub, myfetchtext } from 'hubtools'

const trackDbUrl = process.argv[2]!
const hubFileText = await myfetchtext(trackDbUrl)
fs.writeFileSync(
  process.argv[3]!,
  JSON.stringify(
    generateJBrowseConfigForAssemblyHub({
      hubFileText,
      trackDbUrl,
    }),
    null,
    2,
  ),
)
