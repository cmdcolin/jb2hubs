import { notEmpty, objectHash } from '@jbrowse/core/util/index.js'

import { generateUnknownTrackConf, resolve } from './util.ts'

import type { RaStanza, TrackDbFile } from '@gmod/ucsc-hub'

type Adapter = Record<string, unknown>

export function generateHubTracks({
  trackDb,
  trackDbUrl,
  assemblyName,
  sequenceAdapter,
}: {
  trackDb: TrackDbFile
  trackDbUrl: string
  assemblyName: string
  sequenceAdapter: Adapter
}) {
  const parentTrackKeys = new Set([
    'superTrack',
    'compositeTrack',
    'container',
    'view',
  ])
  return Object.entries(trackDb.data)
    .map(([trackName, track]) => {
      const { data } = track
      if (Object.keys(data).some(key => parentTrackKeys.has(key))) {
        return
      } else {
        const parentTracks = []
        let currentTrackName = trackName
        do {
          currentTrackName = trackDb.data[currentTrackName].data.parent || ''
          if (currentTrackName) {
            currentTrackName = currentTrackName.split(' ')[0]!
            parentTracks.push(trackDb.data[currentTrackName])
          }
        } while (currentTrackName)
        parentTracks.reverse()

        return {
          metadata: {
            ...track.data,
            ...(track.data.html
              ? {
                  html: `<a href="${resolve(track.data.html, trackDbUrl)}">${track.data.html}</a>`,
                }
              : {}),
          },
          category: [
            track.data.group,
            ...parentTracks
              .map(p => p.data.group)
              .filter((f): f is string => !!f),
          ].filter(f => !!f),
          ...makeTrackConfig({
            track,
            trackDbUrl,
            trackDb,
            sequenceAdapter,
          }),
        }
      }
    })
    .filter(f => notEmpty(f))
    .map(r => ({
      ...r,
      trackId: `ucsc-trackhub-${objectHash(r)}`,
      assemblyNames: [assemblyName],
    }))
}

function makeTrackConfig({
  track,
  trackDbUrl,
  trackDb,
  sequenceAdapter,
}: {
  track: RaStanza
  trackDbUrl: string
  trackDb: TrackDbFile
  sequenceAdapter: Adapter
}) {
  const { data } = track

  const parent = data.parent || ''
  const bigDataUrlPre = data.bigDataUrl || ''
  const bigDataIdx = data.bigDataIndex || ''
  if (bigDataIdx) {
    throw new Error("Don't yet support bigDataIdx")
  }
  const trackType = data.type || trackDb.data[parent].data.type || ''
  const name =
    (data.shortLabel || '') + (bigDataUrlPre.includes('xeno') ? ' (xeno)' : '')

  let baseTrackType = trackType.split(' ')[0] || ''
  if (baseTrackType === 'bam' && bigDataUrlPre.toLowerCase().endsWith('cram')) {
    baseTrackType = 'cram'
  }
  const bigDataUrl = new URL(bigDataUrlPre, trackDbUrl)

  switch (baseTrackType) {
    case 'bam': {
      return {
        type: 'AlignmentsTrack',
        name,
        description: data.longLabel,
        adapter: {
          type: 'BamAdapter',
          uri: bigDataUrl,
        },
      }
    }
    case 'cram': {
      return {
        type: 'AlignmentsTrack',
        name,
        description: data.longLabel,
        adapter: {
          type: 'CramAdapter',
          uri: bigDataUrl,
          sequenceAdapter,
        },
      }
    }
    case 'bigWig': {
      return {
        type: 'QuantitativeTrack',
        name,
        description: data.longLabel,
        adapter: {
          type: 'BigWigAdapter',
          uri: bigDataUrl,
        },
      }
    }
    default: {
      if (baseTrackType.startsWith('big')) {
        return {
          type: 'FeatureTrack',
          name,
          description: data.longLabel,
          adapter: {
            type: 'BigBedAdapter',
            uri: bigDataUrl,
          },
        }
      } else if (baseTrackType === 'vcfTabix') {
        return {
          type: 'VariantTrack',
          name,
          description: data.longLabel,
          adapter: {
            type: 'VcfTabixAdapter',
            uri: bigDataUrl,
          },
        }
      } else if (baseTrackType === 'hic') {
        return {
          type: 'HicTrack',
          name,
          description: data.longLabel,
          adapter: {
            type: 'HicAdapter',
            uri: bigDataUrl,
          },
        }
      } else {
        // unsupported types
        //     case 'peptideMapping':
        //     case 'gvf':
        //     case 'ld2':
        //     case 'narrowPeak':
        //     case 'wig':
        //     case 'wigMaf':
        //     case 'halSnake':
        //     case 'bed':
        //     case 'bed5FloatScore':
        //     case 'bedGraph':
        //     case 'bedRnaElements':
        //     case 'broadPeak':
        //     case 'coloredExon':
        return generateUnknownTrackConf(name, baseTrackType)
      }
    }
  }
}
