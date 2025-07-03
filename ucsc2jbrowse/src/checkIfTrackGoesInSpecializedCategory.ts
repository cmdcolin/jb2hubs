import { JBrowseConfig } from './types.ts'

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
  'affyExonProbeset',
])

const specializedTypes = new Set(['pgSnp'])

const specializedGroups = new Set(['denisova', 'neandertal'])

/**
 * Checks if a given track should be categorized as 'Uncommon or Specialized tracks'
 * based on its metadata (type, parent, or group).
 * @param track The track object, potentially containing metadata.
 * @returns True if the track should be in the specialized category, false otherwise.
 */
export function checkIfTrackGoesInSpecializedCategory(
  track: JBrowseConfig['tracks'][number],
): boolean {
  const metadata = track.metadata
  if (!metadata) {
    return false
  }

  const trackType = `${metadata.type}`.split(' ')[0]
  const trackParent = `${metadata.parent}`.split(' ')[0]
  const trackGroup = `${metadata.group}`.split(' ')[0]

  return (
    (trackType && specializedTypes.has(trackType)) ??
    (trackParent && specializedParents.has(trackParent)) ??
    (trackGroup && specializedGroups.has(trackGroup))
  )
}
