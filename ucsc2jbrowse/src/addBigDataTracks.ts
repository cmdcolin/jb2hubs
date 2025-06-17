import fs from 'fs'

import pLimit from 'p-limit'

import { checkIfFileAccessible } from './checkIfFileAccessible.ts'
import { dedupe } from './dedupe.ts'
import { readConfig, readJSON } from './util.ts'

interface BigDataTrack {
  tableName: string
  settings: { bigDataUrl?: string }
}

type BigDataTracksJson = Record<string, BigDataTrack>

const bigDataEntries = readJSON<BigDataTracksJson>(process.argv[2]!)
const config = readConfig(process.argv[3]!)
const base = 'https://hgdownload.soe.ucsc.edu'
const asm0 = config.assemblies[0]!
const n0 = asm0.name

const limit = pLimit(1)
fs.writeFileSync(
  process.argv[3]!,
  JSON.stringify(
    {
      ...config,
      tracks: dedupe(
        [
          ...config.tracks,
          ...(
            await Promise.all(
              Object.values(bigDataEntries).map(val =>
                limit(async () => {
                  const { settings, tableName } = val
                  const { bigDataUrl } = settings
                  const trackId = `${n0}-${tableName}`

                  if (bigDataUrl && !bigDataUrl.includes('fantom')) {
                    const uri = bigDataUrl.startsWith(base)
                      ? bigDataUrl
                      : `${base}${bigDataUrl}`

                    if (
                      bigDataUrl.endsWith('.bb') ||
                      bigDataUrl.endsWith('.bigBed')
                    ) {
                      const fileAccessible = await checkIfFileAccessible({
                        url: bigDataUrl,
                      })
                      if (!fileAccessible) {
                        return undefined
                      } else {
                        return {
                          trackId,
                          name: tableName,
                          type: 'FeatureTrack',
                          assemblyNames: [n0],
                          adapter: {
                            type: 'BigBedAdapter',
                            uri,
                          },
                        }
                      }
                    } else if (bigDataUrl.endsWith('.bam')) {
                      return {
                        trackId,
                        name: tableName,
                        type: 'AlignmentsTrack',
                        assemblyNames: [n0],
                        adapter: {
                          type: 'BamAdapter',
                          uri,
                          // @ts-expect-error
                          sequenceAdapter: asm0.sequence.adapter,
                        },
                      }
                    } else {
                      return {
                        trackId,
                        name: tableName,
                        type: 'QuantitativeTrack',
                        assemblyNames: [n0],
                        adapter: {
                          type: 'BigWigAdapter',
                          uri,
                        },
                      }
                    }
                  } else {
                    return undefined
                  }
                }),
              ),
            )
          ).filter(f => !!f),
        ],
        d => d.trackId,
      ),
    },
    null,
    2,
  ),
)
