const assemblyName = process.argv[2]

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
  hasCyto = true
} catch (_e) {}

console.log(
  JSON.stringify(
    {
      assemblies: [
        {
          assemblyName,
          sequence: {
            type: 'ReferenceSequenceTrack',
            trackId: `${assemblyName}-refseq`,
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
