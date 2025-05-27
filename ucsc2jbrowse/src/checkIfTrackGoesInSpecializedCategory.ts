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

export function checkIfTrackGoesInSpecializedCategory({
  metadata,
}: {
  metadata?: Record<string, unknown>
}) {
  return metadata
    ? specializedTypes.has(`${metadata.type}`.split(' ')[0]!) ||
        specializedParents.has(`${metadata.parent}`.split(' ')[0]!)
    : false
}
