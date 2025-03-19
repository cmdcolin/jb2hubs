import pkg from '@gmod/ucsc-hub'
import { nanoid } from 'nanoid'
import { resolve } from './util.ts'
import { generateTracks } from './generateHubTracks.ts'
import type { FileLocation } from '@jbrowse/core/util'

const { SingleFileHub } = pkg

export function generateConfigFromHub({
  hubFileText,
  hubFileLocation,
}: {
  hubFileText: string
  hubFileLocation: FileLocation
}) {
  // @ts-expect-error
  const hubUri = new URL(hubFileLocation.uri, hubFileLocation.baseUri)
  if (hubFileText.includes('useOneFile on')) {
    const hub = new SingleFileHub(hubFileText)
    const { genome, tracks } = hub
    const genomeName = genome.name!
    const shortLabel = genome.data.description

    const sequenceAdapter = {
      type: 'TwoBitAdapter',
      twoBitLocation: {
        uri: resolve(genome.data.twoBitPath!, hubUri),
      },
      chromSizesLocation: {
        uri: resolve(genome.data.chromSizes!, hubUri),
      },
    }
    const asm = {
      name: genomeName,
      displayName: shortLabel,
      sequence: {
        type: 'ReferenceSequenceTrack',
        metadata: {
          ...genome.data,
          ...(genome.data.htmlPath
            ? {
                htmlPath: `<a href="${resolve(genome.data.htmlPath, hubUri)}">${genome.data.htmlPath}</a>`,
              }
            : {}),
        },
        trackId: `${genomeName}-${nanoid()}`,
        adapter: sequenceAdapter,
      },
      ...(genome.data.chromAliasBb
        ? {
            refNameAliases: {
              adapter: {
                type: 'BigBedAdapter',
                uri: resolve(genome.data.chromAliasBb, hubUri),
              },
            },
          }
        : {}),
    }
    const tracksNew = generateTracks({
      trackDb: tracks,
      trackDbLoc: hubFileLocation,
      assemblyName: genomeName,
      sequenceAdapter,
      baseUrl: hubUri,
    })

    return {
      assemblies: [asm],
      tracks: tracksNew,
    }
  }
  return undefined
}
