import path from 'path'

import { readConfig, writeJSON } from './util.ts'

/**
 * Adds a GFF3Tabix track to a JBrowse configuration file.
 * @param configPath The path to the JBrowse configuration file.
 * @param gffFilePath The path to the GFF3Tabix file (e.g., 'file.gff.gz').
 */
function addGffTabixTrackToConfig(configPath: string, gffFilePath: string) {
  const config = readConfig(configPath)
  const gffFileName = path.basename(gffFilePath)
  const trackId = path.basename(gffFileName, '.gff.gz')
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
      type: 'Gff3TabixAdapter',
      gffGzLocation: { uri: gffFileName },
      index: {
        indexType: 'CSI',
        location: { uri: `${gffFileName}.csi` },
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
    'Usage: node addGffTabixTrackToConfig.ts <config.json> <file.gff.gz>',
  )
  process.exit(1)
}

addGffTabixTrackToConfig(process.argv[2]!, process.argv[3]!)
