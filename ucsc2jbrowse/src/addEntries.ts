import { readConfig, writeJSON } from './util.ts'

import type { JBrowseConfig } from './types.ts'

/**
 * Adds predefined plugins, tracks, and aggregate text search adapters to a JBrowse configuration.
 * @param configPath The path to the JBrowse configuration file.
 */
function addEntries(configPath: string) {
  const config = readConfig(configPath)

  const newPlugins = [
    {
      name: 'MsaView',
      umdLoc: {
        uri: 'jbrowse-plugin-msaview.umd.production.min.js',
      },
    },
    {
      name: 'Protein3d',
      umdLoc: {
        uri: 'jbrowse-plugin-protein3d.umd.production.min.js',
      },
    },
  ]

  const newTracks = [
    {
      type: 'FeatureTrack',
      trackId: 'ncbi_refseq_109_hg38_latest',
      name: 'NCBI RefSeq (GFF3Tabix)',
      assemblyNames: ['hg38'],
      category: ['Annotation'],
      adapter: {
        type: 'Gff3TabixAdapter',
        gffGzLocation: {
          uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/ncbi_refseq/GRCh38_latest_genomic.sort.gff.gz',
          locationType: 'UriLocation',
        },
        index: {
          location: {
            uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/GRCh38/ncbi_refseq/GRCh38_latest_genomic.sort.gff.gz.tbi',
            locationType: 'UriLocation',
          },
        },
      },
    },
    {
      type: 'FeatureTrack',
      trackId: 'ncbi_gff_hg19',
      name: 'NCBI RefSeq w/ subfeature details',
      formatDetails: {
        subfeatures:
          "jexl:{name:'<a href=https://google.com/?q='+feature.name+'>'+feature.name+'</a>'}",
      },
      assemblyNames: ['hg19'],
      category: ['Annotation'],
      metadata: {
        source: 'https://www.ncbi.nlm.nih.gov/genome/guide/human/',
        dateaccessed: '12/03/2020',
      },
      adapter: {
        type: 'Gff3TabixAdapter',
        gffGzLocation: {
          uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/hg19/ncbi_refseq/GRCh37_latest_genomic.sort.gff.gz',
        },
        index: {
          location: {
            uri: 'https://s3.amazonaws.com/jbrowse.org/genomes/hg19/ncbi_refseq/GRCh37_latest_genomic.sort.gff.gz.tbi',
          },
        },
      },
    },
  ]

  const newAggregateTextSearchAdapters = [
    {
      type: 'TrixTextSearchAdapter',
      textSearchAdapterId: 'hg19-index',
      ixFilePath: {
        uri: 'https://jbrowse.org/genomes/hg19/trix/hg19.ix',
        locationType: 'UriLocation',
      },
      ixxFilePath: {
        uri: 'https://jbrowse.org/genomes/hg19/trix/hg19.ixx',
        locationType: 'UriLocation',
      },
      metaFilePath: {
        uri: 'https://jbrowse.org/genomes/hg19/trix/meta.json',
        locationType: 'UriLocation',
      },
      assemblyNames: ['hg19'],
    },
    {
      type: 'TrixTextSearchAdapter',
      textSearchAdapterId: 'hg38-index',
      ixFilePath: {
        uri: 'https://jbrowse.org/genomes/GRCh38/trix/hg38.ix',
        locationType: 'UriLocation',
      },
      ixxFilePath: {
        uri: 'https://jbrowse.org/genomes/GRCh38/trix/hg38.ixx',
        locationType: 'UriLocation',
      },
      metaFilePath: {
        uri: 'https://jbrowse.org/genomes/GRCh38/trix/meta.json',
        locationType: 'UriLocation',
      },
      assemblyNames: ['hg38'],
    },
  ]

  const updatedConfig: JBrowseConfig = {
    ...config,
    plugins: [...(config.plugins ?? []), ...newPlugins],
    tracks: [
      ...config.tracks.map(track => {
        if (track.trackId.startsWith('jaspar')) {
          return {
            ...track,
            displays: [
              {
                type: 'LinearBasicDisplay',
                displayId: `${track.trackId}-LinearBasicDisplay`,
                jexlFilters: ["get(feature,'score')>400"],
                renderer: {
                  type: 'SvgFeatureRenderer',
                  labels: {
                    name: "jexl:get(feature,'TFName')",
                  },
                },
              },
            ],
          }
        }
        return track
      }),
      ...newTracks,
    ],
    aggregateTextSearchAdapters: [
      ...(config.aggregateTextSearchAdapters ?? []),
      ...newAggregateTextSearchAdapters,
    ],
  }

  writeJSON(configPath, updatedConfig)
}

if (process.argv.length !== 3) {
  console.error('Usage: node addEntries.ts <config.json>')
  process.exit(1)
}

addEntries(process.argv[2]!)
