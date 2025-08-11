import fs from 'fs'

import { readConfig, writeJSON } from './util.ts'

function modifyTracks(configPath: string, mappings: { [key: string]: string }) {
  const config = readConfig(configPath)
  const trackIds = Object.keys(mappings)

  for (const trackId of trackIds) {
    const newName = mappings[trackId]!
    if (newName === 'DELETE') {
      config.tracks = config.tracks?.filter(track => track.trackId !== trackId)
    } else if (config.tracks) {
      const track = config.tracks.find(t => t.trackId === trackId)
      if (track) {
        track.name = newName
      }
    }
  }
  writeJSON(configPath, config)
}

if (process.argv.length !== 4) {
  console.error(
    'Usage: node rewriteUcscTrackNames.ts <configFile> <mappingsFile>',
  )
  process.exit(1)
}

const configFile = process.argv[2]!
const mappingsFile = process.argv[3]!
const mappings = JSON.parse(fs.readFileSync(mappingsFile, 'utf-8'))
modifyTracks(configFile, mappings)
