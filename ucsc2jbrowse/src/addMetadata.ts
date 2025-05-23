import { categoryMap } from 'hubtools'

import { readConfig, readJSON, replaceLink, splitOnFirst } from './util.ts'

import type { TrackDbEntry } from './types.ts'

const config = readConfig(process.argv[2]!)
const tracksDb = readJSON(process.argv[3]!) as Record<string, TrackDbEntry>

const specializedParents = new Set([
  'exomeProbesets',
  'genotypeArrays',
  'genePredArchive',
  'lincRNAsAllCellType',
  'knownGeneArchive',
  'affyExonProbe',
  'burgeRnaSeqGemMapperAlignViewRawSignal',
  'burgeRnaSeqGemMapperAlignViewAlignments',
  'gtexEqtlTissue',
  'gtexCov',
  'gnomadPext',
  'gdcCancer',
])
const specializedTypes = new Set(['pgSnp'])
function checkSpecialized({
  metadata,
}: {
  metadata?: Record<string, unknown>
}) {
  return metadata
    ? specializedTypes.has(`${metadata.type}`.split(' ')[0]!) ||
        specializedParents.has(`${metadata.parent}`.split(' ')[0]!)
    : false
}
console.log(
  JSON.stringify(
    {
      ...config,
      tracks: config.tracks
        .map(t => {
          const [_asm, ...rest] = t.trackId.split('-')
          const trackLabelWithoutAssemblyName = rest.join('-')
          const track = tracksDb[trackLabelWithoutAssemblyName]
          if (track) {
            const { settings, html, longLabel, shortLabel, grp, ...rest } =
              track
            const s2 = Object.fromEntries(
              settings
                .split('\n')
                .map(r => splitOnFirst(r, ' '))
                .filter(([key]) => !!key),
            )
            const r0 = s2.parent ? splitOnFirst(s2.parent, ' ')[0] : undefined
            const r1 = r0 ? tracksDb[r0] : undefined
            const r2 = r1?.shortLabel
            return {
              ...t,
              metadata: {
                ...rest,
                ...s2,
                html: replaceLink(html),
              },
              name: [r2, shortLabel].filter(f => !!f).join(' - '),
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
          category: checkSpecialized(track)
            ? ['Uncommon or Specialized tracks', ...(track.category || [])]
            : [...(track.category || [])],
        })),
    },
    null,
    2,
  ),
)
