import fs from 'fs'

import { generateJBrowseConfigForAssemblyHub } from 'hubtools'

fs.writeFileSync(
  process.argv[3]!,
  JSON.stringify(
    generateJBrowseConfigForAssemblyHub({
      hubFileText: fs.readFileSync(process.argv[2]!, 'utf8'),
      trackDbUrl:
        'https://hgdownload.soe.ucsc.edu/gbdb/hs1/hubs/public/hub.txt',
    }),
    null,
    2,
  ),
)

// TODO:add scoreColumn hack back
