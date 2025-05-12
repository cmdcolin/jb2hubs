import fs from 'fs'
import path from 'path'

import { readConfig } from './util.ts'

if (process.argv.length < 3) {
  throw new Error(
    `usage: ${process.argv[0]} ${process.argv[1]} <config.json> <file.gff.gz>`,
  )
}

const config = readConfig(process.argv[2]!)
const arg = path.basename(process.argv[3]!)
const base = path.basename(arg, '.sorted.gff.gz')
const asm0 = config.assemblies[0]!
const n0 = asm0.name
const trackId = `${n0}-${base}`

const newTrack = {
  type: 'FeatureTrack',
  trackId,
  name: base,
  assemblyNames: [n0],
  adapter: {
    type: 'Gff3TabixAdapter',
    gffGzLocation: { uri: arg },
    index: {
      indexType: 'CSI',
      location: { uri: arg + '.csi' },
    },
  },
}

const existingTrackIndex = config.tracks.findIndex(f => f.trackId === trackId)

let updatedTracks
if (existingTrackIndex >= 0) {
  console.log(`Replacing existing track with ID "${trackId}"`)
  updatedTracks = [...config.tracks]
  updatedTracks[existingTrackIndex] = newTrack
} else {
  console.log(`Adding new track with ID "${trackId}"`)
  updatedTracks = [...config.tracks, newTrack]
}

// Write updated config
fs.writeFileSync(
  process.argv[2]!,
  JSON.stringify(
    {
      ...config,
      tracks: updatedTracks,
    },
    null,
    2,
  ),
)
