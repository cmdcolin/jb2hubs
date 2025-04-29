import fs from 'fs'

import { generateJBrowseConfigForAssemblyHub } from 'toolshub'

const hubFileText = fs.readFileSync(process.argv[2]!, 'utf8')

fs.writeFileSync(
  process.argv[3]!,
  JSON.stringify(
    generateJBrowseConfigForAssemblyHub({
      hubFileText,
      trackDbUrl:
        'https://hgdownload.soe.ucsc.edu/gbdb/hs1/hubs/public/hub.txt',
    }),
    null,
    2,
  ),
)

export function resolve(uri: string, baseUri: string | URL) {
  return new URL(uri, baseUri).href
}

// TODO:add scoreColumn hack back
