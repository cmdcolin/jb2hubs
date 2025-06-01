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
const specializedTracks = new Set(['denisovaMethylation'])

export function checkIfTrackGoesInSpecializedCategory({
  metadata,
}: {
  metadata?: Record<string, unknown>
}) {
  return metadata
    ? specializedTypes.has(`${metadata.type}`.split(' ')[0]!) ||
        specializedParents.has(`${metadata.parent}`.split(' ')[0]!) ||
        specializedTracks.has(`${metadata.tableName}`.split(' ')[0]!)
    : false
}
