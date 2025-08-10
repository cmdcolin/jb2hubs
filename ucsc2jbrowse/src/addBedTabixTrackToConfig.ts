import path from 'path'

import { readConfig, writeJSON } from './util.ts'

function addBedTabixTrackToConfig(configPath: string, bedFilePath: string) {
  const config = readConfig(configPath)
  const bedFileName = path.basename(bedFilePath)
  const trackId = path.basename(bedFileName, '.bed.gz')
  const assemblyName = config.assemblies[0]?.name

  if (!assemblyName) {
    throw new Error('Assembly name not found in config')
  }

  const newTrack = {
    type: 'FeatureTrack',
    trackId: `${assemblyName}-${trackId}`,
    name: trackId,
    assemblyNames: [assemblyName],
    adapter: {
      type: 'BedTabixAdapter',
      bedGzLocation: { uri: bedFileName },
      index: {
        indexType: 'CSI',
        location: { uri: `${bedFileName}.csi` },
      },
    },
  }

  if (config.tracks) {
    const existingTrackIndex = config.tracks.findIndex(
      track => track.trackId === newTrack.trackId,
    )

    if (existingTrackIndex !== -1) {
      config.tracks[existingTrackIndex] = newTrack
    } else {
      config.tracks.push(newTrack)
    }
  }

  writeJSON(configPath, config)
}

if (process.argv.length !== 4) {
  console.error(
    'Usage: node addBedTabixTrackToConfig.ts <config.json> <file.bed.gz>',
  )
  process.exit(1)
}

addBedTabixTrackToConfig(process.argv[2]!, process.argv[3]!)
