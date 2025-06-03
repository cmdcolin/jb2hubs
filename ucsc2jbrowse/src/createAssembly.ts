import { readJSON } from './util.ts'
import { inflate } from 'pako'

const assemblyName = process.argv[2]!
const list = process.argv[3]!

const f = (j: string) =>
  `https://hgdownload.soe.ucsc.edu/goldenPath/${assemblyName}/bigZips/${j}`

const g = () =>
  `https://hgdownload.soe.ucsc.edu/goldenPath/${assemblyName}/database/cytoBandIdeo.txt.gz`

let hasAliases = false
try {
  const res = await fetch(f(`${assemblyName}.chromAlias.txt`))
  if (!res.ok) {
    throw new Error('Error fetching chromAlias')
  }
  hasAliases = true
} catch (_e) {}

let hasCyto = false
try {
  const res = await fetch(g())
  if (!res.ok) {
    throw new Error('Error fetching cytobands')
  }
  const ret = await res.arrayBuffer()
  const text = inflate(ret)
  const txt = new TextDecoder().decode(text)
  const allGneg = txt
    .split('\n')
    .map(f => f.trim())
    .filter(f => !!f)
    .every(line => line.split('\t')[4] === 'gneg')
  hasCyto = allGneg ? false : true
} catch (_e) {}

interface GenomeRecord {
  organism: string
}

const metadata = readJSON<{ ucscGenomes: Record<string, GenomeRecord> }>(list)
  .ucscGenomes[assemblyName]
console.log(
  JSON.stringify(
    {
      assemblies: [
        {
          name: assemblyName,
          displayName: `${metadata?.organism} (${assemblyName})`,
          sequence: {
            type: 'ReferenceSequenceTrack',
            trackId: `${assemblyName}-refseq`,
            metadata,
            adapter: {
              type: 'TwoBitAdapter',
              uri: f(`${assemblyName}.2bit`),
              chromSizes: f(`${assemblyName}.chrom.sizes`),
            },
          },
          ...(hasAliases
            ? {
                refNameAliases: {
                  adapter: {
                    type: 'RefNameAliasAdapter',
                    uri: f(`${assemblyName}.chromAlias.txt`),
                  },
                },
              }
            : {}),
          ...(hasCyto
            ? {
                cytobands: {
                  adapter: {
                    type: 'CytobandAdapter',
                    uri: g(),
                  },
                },
              }
            : {}),
        },
      ],
      tracks: [],
    },
    null,
    2,
  ),
)

export {}
