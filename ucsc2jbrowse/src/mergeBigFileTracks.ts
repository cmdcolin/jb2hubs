import pLimit from 'p-limit'

import { checkIfFileAccessible } from './checkIfFileAccessible.ts'
import { dedupe } from './dedupe.ts'
import { readConfig, readJSON, splitOnFirst, writeJSON } from './util.ts'

import type { TrackDbEntry } from './types.ts'

interface BigDataTrack {
  tableName: string
  settings: { bigDataUrl?: string; type: string }
}

type BigDataTracksJson = Record<string, BigDataTrack>

/**
 * Parses a tracks.json file to extract information about bigData and BAM tracks.
 * It filters tracks based on their 'type' (starting with 'big' or 'bam')
 * and processes their settings string into a key-value object.
 * @param tracksJsonPath The path to the tracks.json file.
 * @returns A promise that resolves to the parsed big file tracks.
 */
function parseBigFileTracks(tracksJsonPath: string): BigDataTracksJson {
  const tracks = readJSON<Record<string, TrackDbEntry>>(tracksJsonPath)

  // @ts-expect-error
  return Object.fromEntries(
    Object.entries(tracks)
      .filter(([_key, trackEntry]) =>
        ['big', 'bam'].some(prefix => trackEntry.type.startsWith(prefix)),
      )
      .map(([key, trackEntry]) => {
        // Parse the settings string into an object
        const settings = Object.fromEntries(
          trackEntry.settings
            .split('\n')
            .map(settingLine => splitOnFirst(settingLine, ' '))
            .filter(([settingKey]) => !!settingKey),
        )
        return [
          key,
          {
            ...trackEntry,
            settings,
          },
        ]
      }),
  )
}

async function addBigDataTracks(
  bigDataEntries: BigDataTracksJson,
  configPath: string,
) {
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
          const { type, bigDataUrl } = settings
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
            if (type === 'bigMaf') {
              return {
                trackId,
                name: tableName,
                type: 'MafTrack',
                assemblyNames: [assemblyName],
                adapter: {
                  type: 'BigMafAdapter',
                  bigBedLocation: {
                    uri: bigDataUrl,
                  },
                },
              }
            } else {
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
  console.error('Usage: node mergeBigFileTracks.ts <tracks.json> <config.json>')
  process.exit(1)
}

const tracksJsonPath = process.argv[2]!
const configPath = process.argv[3]!

await addBigDataTracks(parseBigFileTracks(tracksJsonPath), configPath)
