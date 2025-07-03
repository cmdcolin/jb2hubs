import { categoryMap } from 'hubtools'

import { checkIfTrackGoesInSpecializedCategory } from './checkIfTrackGoesInSpecializedCategory'
import {
  readConfig,
  writeJSON,
  readJSON,
  replaceLink,
  splitOnFirst,
} from './util'

import type { TrackDbEntry, JBrowseConfig } from './types'

/**
 * Adds metadata from a trackDb.json file to a JBrowse configuration's tracks.
 * @param configPath The path to the JBrowse configuration file.
 * @param tracksDbPath The path to the tracksDb.json file.
 */
function addMetadata(configPath: string, tracksDbPath: string) {
  const config = readConfig(configPath)
  const tracksDb = readJSON<Record<string, TrackDbEntry>>(tracksDbPath)

  const updatedTracks = config.tracks
    .map(track => {
      const [, trackLabelWithoutAssemblyName] = splitOnFirst(track.trackId, '-')
      const trackDbEntry = tracksDb[trackLabelWithoutAssemblyName]

      if (trackDbEntry) {
        const { settings, html, longLabel, shortLabel, grp } = trackDbEntry
        const trackMetadata = Object.fromEntries(
          settings
            .split('\n')
            .map(r => splitOnFirst(r, ' '))
            .filter(([key]) => !!key),
        )
        const parentTrackId = trackMetadata.parent
          ? splitOnFirst(trackMetadata.parent, ' ')[0]
          : undefined
        const parentTrack = parentTrackId ? tracksDb[parentTrackId] : undefined

        return {
          ...track,
          metadata: {
            ...track.metadata,
            ...trackMetadata,
            html: replaceLink(html),
          },
          name: [parentTrack?.shortLabel, shortLabel]
            .filter(f => !!f)
            .join(' - '),
          description: longLabel,
          category: [
            ...(track.category ?? []),
            ...(grp
              ? [categoryMap[grp as keyof typeof categoryMap] ?? grp]
              : []),
          ].filter(f => !!f),
        }
      } else {
        console.warn('Track not found in trackDb', track.trackId)
        return track
      }
    })
    .map(track => ({
      ...track,
      category: checkIfTrackGoesInSpecializedCategory(track)
        ? ['Uncommon or Specialized tracks', ...(track.category ?? [])]
        : [...(track.category ?? [])],
    }))

  const updatedConfig: JBrowseConfig = {
    ...config,
    tracks: updatedTracks,
  }

  writeJSON(configPath, updatedConfig)
}

if (require.main === module) {
  if (process.argv.length !== 4) {
    console.error('Usage: ts-node addMetadata.ts <config.json> <tracksDb.json>')
    process.exit(1)
  }

  addMetadata(process.argv[2], process.argv[3])
}
