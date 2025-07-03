import type { JBrowseConfig } from './types.ts'
import { readConfig, writeJSON } from './util.ts'

/**
 * Removes older versions of specific tracks from a JBrowse configuration.
 * This is useful for keeping only the latest version of tracks like Gencode or dbSNP.
 * @param configPath The path to the JBrowse configuration file.
 */
function removeEverythingButLatest(configPath: string) {
  const config = readConfig(configPath)

  const trackPrefixesToRemoveOldVersions = [
    'wgEncodeGencodePolyaV',
    'wgEncodeGencodePseudoGeneV',
    'wgEncodeGencodeCompV',
    'wgEncodeGencodeBasicV',
    'wgEncodeGencode2wayConsPseudoV',
    'cloneEndABC',
  ]

  let updatedTracks = [...config.tracks]

  for (const prefix of trackPrefixesToRemoveOldVersions) {
    // Filter tracks that match the current prefix
    const tracksWithPrefix = updatedTracks.filter(track =>
      track.trackId.startsWith(prefix),
    )

    // Sort them to easily identify the latest (assuming lexicographical sort works for versions)
    tracksWithPrefix.sort((a, b) => a.trackId.localeCompare(b.trackId))

    // Keep only the last (latest) track, mark others for removal
    const trackIdsToRemove = new Set<string>()
    for (let i = 0; i < tracksWithPrefix.length - 1; i++) {
      trackIdsToRemove.add(tracksWithPrefix[i]!.trackId)
    }

    // Filter out the tracks marked for removal
    updatedTracks = updatedTracks.filter(
      track => !trackIdsToRemove.has(track.trackId),
    )
  }

  const updatedConfig: JBrowseConfig = {
    ...config,
    tracks: updatedTracks,
  }

  writeJSON(configPath, updatedConfig)
}

if (process.argv.length !== 3) {
  console.error('Usage: node removeEverythingButLatest.ts <config.json>')
  process.exit(1)
}

removeEverythingButLatest(process.argv[2]!)
