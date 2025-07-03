import pLimit from 'p-limit'

import { checkIfFileAccessible } from './checkIfFileAccessible.ts'
import { dedupe } from './dedupe.ts'
import { readConfig, readJSON, writeJSON } from './util.ts'

interface BigDataTrack {
  tableName: string
  settings: { bigDataUrl?: string }
}

type BigDataTracksJson = Record<string, BigDataTrack>

async function addBigDataTracks(
  bigDataEntriesPath: string,
  configPath: string,
) {
  const bigDataEntries = readJSON<BigDataTracksJson>(bigDataEntriesPath)
  const config = readConfig(configPath)
  const baseUrl = 'https://hgdownload.soe.ucsc.edu'
  const assembly = config.assemblies[0]

  if (!assembly) {
    console.warn(
      'No assembly found in config. Skipping big data track addition.',
    )
    return
  }

  const assemblyName = assembly.name
  const sequenceAdapter = assembly.sequence?.adapter

  const limit = pLimit(1)

  const newTracks = (
    await Promise.all(
      Object.values(bigDataEntries).map(entry =>
        limit(async () => {
          const { settings, tableName } = entry
          const { bigDataUrl } = settings
          const trackId = `${assemblyName}-${tableName}`

          if (!bigDataUrl || bigDataUrl.includes('fantom')) {
            return undefined
          }

          const uri = bigDataUrl.startsWith(baseUrl)
            ? bigDataUrl
            : `${baseUrl}${bigDataUrl}`

          if (bigDataUrl.endsWith('.bb') || bigDataUrl.endsWith('.bigBed')) {
            const fileAccessible = await checkIfFileAccessible({
              url: bigDataUrl,
            })
            if (!fileAccessible) {
              return undefined
            }
            return {
              trackId,
              name: tableName,
              type: 'FeatureTrack',
              assemblyNames: [assemblyName],
              adapter: {
                type: 'BigBedAdapter',
                uri,
              },
            }
          } else if (bigDataUrl.endsWith('.bam')) {
            if (!sequenceAdapter) {
              console.warn(
                `Skipping BAM track ${tableName}: No sequence adapter found for assembly ${assemblyName}`,
              )
              return undefined
            }
            return {
              trackId,
              name: tableName,
              type: 'AlignmentsTrack',
              assemblyNames: [assemblyName],
              adapter: {
                type: 'BamAdapter',
                uri,
                sequenceAdapter,
              },
            }
          } else {
            return {
              trackId,
              name: tableName,
              type: 'QuantitativeTrack',
              assemblyNames: [assemblyName],
              adapter: {
                type: 'BigWigAdapter',
                uri,
              },
            }
          }
        }),
      ),
    )
  ).filter(track => !!track)

  config.tracks = dedupe(
    [...config.tracks, ...newTracks],
    track => track.trackId,
  )

  writeJSON(configPath, config)
}

if (process.argv.length !== 4) {
  console.error(
    'Usage: node addBigDataTracks.ts <bigDataEntries.json> <config.json>',
  )
  process.exit(1)
}

await addBigDataTracks(process.argv[2]!, process.argv[3]!)
