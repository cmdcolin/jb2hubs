import fs from 'node:fs'
import { objectHash } from '@jbrowse/core/util/index.js'

export function resolve(uri: string, baseUri: string | URL) {
  return new URL(uri, baseUri).href
}

export async function myfetchtext(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`)
  }
  return res.text()
}

export function makeLoc(
  first: string,
  base: { uri: string; baseUri?: string },
) {
  return {
    uri: new URL(first, new URL(base.uri, base.baseUri)).href,
    locationType: 'UriLocation',
  }
}

export function makeLocAlt(first: string, alt: string, base: { uri: string }) {
  return first ? makeLoc(first, base) : makeLoc(alt, base)
}

export function makeLoc2(first: string, alt?: string) {
  return first
    ? {
        uri: first,
        locationType: 'LocalPath',
      }
    : {
        uri: alt,
        locationType: 'UriLocation',
      }
}

export function generateUnknownTrackConf(
  trackName: string,
  trackUrl: string,
  categories?: string[],
) {
  const conf = {
    type: 'FeatureTrack',
    name: `${trackName} (Unknown)`,
    description: `Could not determine track type for "${trackUrl}"`,
    category: categories,
    trackId: '',
  }
  conf.trackId = objectHash(conf)
  return conf
}

export function readJSON(f: string) {
  return JSON.parse(fs.readFileSync(f, 'utf8'))
}
