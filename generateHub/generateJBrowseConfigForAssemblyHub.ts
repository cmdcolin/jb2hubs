import pkg from '@gmod/ucsc-hub'
import { resolve } from './util.ts'
import { generateHubTracks } from './generateHubTracks.ts'
import type { FileLocation } from '@jbrowse/core/util'

const { SingleFileHub } = pkg

export function generateJBrowseConfigForAssemblyHub({
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
    const { data } = genome
    const { twoBitPath, chromSizes, htmlPath, chromAliasBb } = data
    const genomeName = genome.name!
    const shortLabel = data.description

    const sequenceAdapter = {
      type: 'TwoBitAdapter',
      uri: resolve(twoBitPath, hubUri),
      chromSizes: resolve(chromSizes, hubUri),
    }
    const asm = {
      name: genomeName,
      displayName: shortLabel,
      sequence: {
        type: 'ReferenceSequenceTrack',
        metadata: {
          ...data,
          ...(htmlPath
            ? {
                htmlPath: `<a href="${resolve(htmlPath, hubUri)}">${htmlPath}</a>`,
              }
            : {}),
        },
        trackId: `${genomeName}-ReferenceSequenceTrack`,
        adapter: sequenceAdapter,
      },
      ...(chromAliasBb
        ? {
            refNameAliases: {
              adapter: {
                type: 'RefNameAliasAdapter',
                refNameColumn: 4,
                uri: resolve(chromAliasBb.replace('.bb', '.txt'), hubUri),
              },
            },
          }
        : {}),
    }

    return {
      assemblies: [asm],
      tracks: generateHubTracks({
        trackDb: tracks,
        trackDbLoc: hubFileLocation,
        assemblyName: genomeName,
        sequenceAdapter,
        baseUrl: hubUri,
      }),
    }
  }
  return
}
