import { inflate } from 'pako'

import { readJSON } from './util.ts'

const assemblyName = process.argv[2]!
const list = process.argv[3]!

const getBigDataLink = (j: string) =>
  `https://hgdownload.soe.ucsc.edu/goldenPath/${assemblyName}/bigZips/${j}`

const getCytoBandLink = () =>
  `https://hgdownload.soe.ucsc.edu/goldenPath/${assemblyName}/database/cytoBand.txt.gz`

const getCytoBandIdeoLink = () =>
  `https://hgdownload.soe.ucsc.edu/goldenPath/${assemblyName}/database/cytoBandIdeo.txt.gz`

let hasAliases = false
try {
  const res = await fetch(getBigDataLink(`${assemblyName}.chromAlias.txt`))
  if (!res.ok) {
    throw new Error('Error fetching chromAlias')
  }
  hasAliases = true
} catch (_e) {}

let cytoLink = undefined
try {
  const cytoTxtLink = getCytoBandLink()
  const res = await fetch(cytoTxtLink)
  if (!res.ok) {
    const cytoIdeoLink = getCytoBandIdeoLink()
    const ideoRes = await fetch(cytoIdeoLink)
    if (!ideoRes.ok) {
      throw new Error('Error fetching cytobands')
    }
    const ret = await ideoRes.arrayBuffer()
    const text = inflate(ret)
    const txt = new TextDecoder().decode(text)
    const allGneg = txt
      .split('\n')
      .map(f => f.trim())
      .filter(f => !!f)
      .every(line => line.split('\t')[4] === 'gneg')
    cytoLink = allGneg ? undefined : cytoIdeoLink
  } else {
    const ret = await res.arrayBuffer()
    const text = inflate(ret)
    const txt = new TextDecoder().decode(text)
    const allGneg = txt
      .split('\n')
      .map(f => f.trim())
      .filter(f => !!f)
      .every(line => line.split('\t')[4] === 'gneg')
    cytoLink = allGneg ? undefined : cytoTxtLink
  }
} catch (_e) {}

interface GenomeRecord {
  organism: string
}

const metadata = readJSON<{ ucscGenomes: Record<string, GenomeRecord> }>(list)
  .ucscGenomes[assemblyName]
console.log(
  JSON.stringify(
    {
      plugins: [
        {
          name: 'MafViewer',
          url: 'https://unpkg.com/jbrowse-plugin-mafviewer/dist/jbrowse-plugin-mafviewer.umd.production.min.js',
        },
        {
          name: 'Hubs',
          url: 'https://unpkg.com/@cmdcolin/jbrowse-plugin-hubs/dist/jbrowse-plugin-hubs.umd.production.min.js',
        },
        {
          name: 'Protein3d',
          url: 'https://unpkg.com/jbrowse-plugin-protein3d/dist/jbrowse-plugin-protein3d.umd.production.min.js',
        },
        {
          name: 'MsaView',
          url: 'https://unpkg.com/jbrowse-plugin-msaview/dist/jbrowse-plugin-msaview.umd.production.min.js',
        },
      ],

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
              uri: getBigDataLink(`${assemblyName}.2bit`),
              chromSizes: getBigDataLink(`${assemblyName}.chrom.sizes`),
            },
          },
          ...(hasAliases
            ? {
                refNameAliases: {
                  adapter: {
                    type: 'RefNameAliasAdapter',
                    uri: getBigDataLink(`${assemblyName}.chromAlias.txt`),
                  },
                },
              }
            : {}),
          ...(cytoLink
            ? {
                cytobands: {
                  adapter: {
                    type: 'CytobandAdapter',
                    uri: cytoLink,
                  },
                },
              }
            : {}),
        },
      ],
      tracks: [],
      configuration: {
        hierarchical: {
          sort: {
            trackNames: true,
            categories: true,
          },
          defaultCollapsed: {
            subCategories: true, // collapse all subcategories on initial startup
          },
        },
      },
    },
    null,
    2,
  ),
)

export {}
