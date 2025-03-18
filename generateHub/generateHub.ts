import fs from 'fs'
import readline from 'readline'
import path from 'path'
import pkg from '@gmod/ucsc-hub'
import { nanoid } from 'nanoid'
import { myfetchtext, resolve } from './util.ts'
import { generateTracks } from './generateHubTracks.ts'

const { SingleFileHub } = pkg

const filePath = process.argv[2]

const rl = readline.createInterface({
  input: fs.createReadStream(filePath),
  crlfDelay: Infinity,
})

async function generateConfigFromHub(hubFileLocation: {
  uri: string
  baseUri: string
}) {
  const hubFileText = await myfetchtext(hubFileLocation.uri)
  const hubUri = resolve(hubFileLocation.uri, hubFileLocation.baseUri)
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
}

const asms = []
for await (const line of rl) {
  if (line.startsWith('#')) {
    continue
  } else {
    const [
      accession,
      assembly,
      scientificName,
      commonName,
      taxonId,
      genArkClade,
    ] = line.split('\t')
    asms.push({
      accession,
      assembly,
      scientificName,
      commonName,
      taxonId,
      genArkClade,
    })
  }

  const hubs = []
  for (const asm of asms.slice(0, 1)) {
    const { accession } = asm
    const [base, rest] = accession.split('_')
    const [b1, b2, b3] = rest.match(/.{1,3}/g)
    console.log({ parts })
    hubs.push(
      await generateConfigFromHub({
        uri: `https://hgdownload.soe.ucsc.edu/hubs/${base}/${b1}/${b2}/${b3}/${accession}/`,
        baseUri: 'http://localhost',
      }),
    )
  }
}

// console.log({ asms })
