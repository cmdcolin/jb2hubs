import fs from 'fs'
import { readConfig } from './util'

const file = process.argv[2]!
const config = readConfig(file)

const specializedParents = new Set([
  'exomeProbesets',
  'cadd',
  'genotypeArrays',
  'genePredArchive',
  'lincRNAsAllCellType',
  'knownGeneArchive',
  'affyExonProbe',
  'burgeRnaSeqGemMapperAlignViewRawSignal',
  'burgeRnaSeqGemMapperAlignViewAlignments',
  'gtexEqtlTissue',
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
fs.writeFileSync(
  file,
  JSON.stringify(
    {
      ...config,
      tracks: config.tracks.map(track => ({
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
