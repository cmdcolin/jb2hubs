import { categoryMap } from 'hubtools'

import { checkIfTrackGoesInSpecializedCategory } from './checkIfTrackGoesInSpecializedCategory.ts'
import { readConfig, readJSON, replaceLink, splitOnFirst } from './util.ts'

import type { TrackDbEntry } from './types.ts'

const config = readConfig(process.argv[2]!)
const tracksDb = readJSON(process.argv[3]!) as Record<string, TrackDbEntry>
console.log(
  JSON.stringify(
    {
      ...config,
      tracks: config.tracks
        .map(t => {
          const [, trackLabelWithoutAssemblyName] = splitOnFirst(t.trackId, '-')
          const track = tracksDb[trackLabelWithoutAssemblyName]
          if (track) {
            const { settings, html, longLabel, shortLabel, grp, ...rest } =
              track
            const trackMetadata = Object.fromEntries(
              settings
                .split('\n')
                .map(r => splitOnFirst(r, ' '))
                .filter(([key]) => !!key),
            )
            const parentTrackId = trackMetadata.parent
              ? splitOnFirst(trackMetadata.parent, ' ')[0]
              : undefined
            return {
              ...t,
              metadata: {
                ...rest,
                ...trackMetadata,
                html: replaceLink(html),
              },
              name: [
                (parentTrackId ? tracksDb[parentTrackId] : undefined)
                  ?.shortLabel,
                shortLabel,
              ]
                .filter(f => !!f)
                .join(' - '),
              description: longLabel,
              category: [grp]
                .filter(f => !!f)
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                .map(r => categoryMap[r as keyof typeof categoryMap] ?? r),
            }
          } else {
            console.error('track not found in trackDb', t.trackId)
            return t
          }
        })
        .map(track => ({
          ...track,
          category: checkIfTrackGoesInSpecializedCategory(track)
            ? ['Uncommon or Specialized tracks', ...(track.category ?? [])]
            : [...(track.category ?? [])],
        })),
    },
    null,
    2,
  ),
)
