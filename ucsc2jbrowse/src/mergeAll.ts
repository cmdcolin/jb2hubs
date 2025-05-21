import fs from 'fs'
import os from 'os'
import path from 'path'

import { readConfig } from './util.ts'

const base = 'configs'
const ret = fs
  .readdirSync(base)
  .map(file => readConfig(path.join(base, file)))
  .map(config => {
    // @ts-expect-error
    addRelativeUris(config, config.assemblies[0]!.name)
    return config
  })

export function addRelativeUris(
  config: Record<string, unknown> | null,
  base: URL,
) {
  if (typeof config === 'object' && config !== null) {
    for (const key of Object.keys(config)) {
      if (typeof config[key] === 'object' && config[key] !== null) {
        addRelativeUris(config[key] as Record<string, unknown>, base)
      } else if (key === 'uri') {
        const s = config[key] as string
        config[key] = s.startsWith('http') ? s : `${base}/${s}`
      }
    }
  }
}

fs.writeFileSync(
  path.join(os.homedir(), 'ucscResults', 'all.json'),
  JSON.stringify(
    {
      assemblies: ret.flatMap(r => r.assemblies),
      aggregateTextSearchAdapters: ret.flatMap(
        r => r.aggregateTextSearchAdapters ?? [],
      ),
      tracks: ret.flatMap(r => r.tracks),
    },
    null,
    2,
  ),
)
