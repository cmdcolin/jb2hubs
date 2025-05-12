import fs from 'fs'
import path from 'path'
import os from 'os'
import { readConfig } from './util.ts'

const base = 'configs'
const ret = fs
  .readdirSync(base)
  .map(file => readConfig(path.join(base, file)))
  .map(config => {
    // @ts-expect-error
    addRelativeUris(config, `${config.assemblies[0]!.name}`)
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
        config[key] = `${base}/${config[key]}`
      }
    }
  }
}

fs.writeFileSync(
  path.join(os.homedir(), 'ucscResults', 'all.json'),
  JSON.stringify(
    {
      assemblies: ret.map(r => r.assemblies).flat(),
      tracks: ret
        .map(r =>
          r.tracks.map(track => ({
            ...track,
            trackId: `${r.assemblies[0]!.name}-${track.trackId}`,
          })),
        )
        .flat(),
    },
    null,
    2,
  ),
)
