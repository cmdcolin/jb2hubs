import { readJSON, splitOnFirst } from './util.ts'

import type { TrackDbEntry } from './types.ts'

if (!process.argv[2]) {
  throw new Error(`usage: ${process.argv[0]} ${process.argv[1]} <tracks.json>`)
}

const tracks = readJSON<Record<string, TrackDbEntry>>(process.argv[2])

console.log(
  JSON.stringify(
    Object.fromEntries(
      Object.entries(tracks)
        .filter(
          ([_key, val]) =>
            val.type.startsWith('big') || val.type.startsWith('bam'),
        )
        .map(([key, val]) => {
          return [
            key,
            {
              ...val,
              settings: Object.fromEntries(
                val.settings
                  .split('\n')
                  .map(s => splitOnFirst(s, ' '))
                  .filter(f => !!f[0]),
              ),
            },
          ]
        }),
    ),
    null,
    2,
  ),
)
