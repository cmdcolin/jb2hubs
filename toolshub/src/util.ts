import fs from 'node:fs'
import path from 'node:path'

import { notEmpty } from './notEmpty.ts'

import type { APIData, NCBIData } from './types.ts'

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
  base: {
    uri: string
    baseUri?: string
  },
) {
  return {
    uri: new URL(first, new URL(base.uri, base.baseUri)).href,
    locationType: 'UriLocation',
  }
}

export function makeLocAlt(
  first: string,
  alt: string,
  base: {
    uri: string
  },
) {
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

export function readJSON(f: string) {
  return JSON.parse(fs.readFileSync(f, 'utf8')) as unknown
}

export function writeJSON(f: string, d: unknown) {
  fs.writeFileSync(f, JSON.stringify(d, undefined, 2))
}

function extractStats(xmlString: string) {
  const stats = {} as Record<string, unknown>
  const statsRegex =
    /<Stat category="([^"]+)" sequence_tag="([^"]+)">([^<]+)<\/Stat>/g
  let match

  while ((match = statsRegex.exec(xmlString)) !== null) {
    stats[match[1]!] = match[3]!
  }

  return stats
}

export async function myjsonfetch(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`)
  }
  return res.json() as Promise<unknown>
}

export type AssemblyData = ReturnType<typeof parseAssemblyEntry>
