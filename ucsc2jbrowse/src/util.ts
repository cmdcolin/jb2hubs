import fs from 'node:fs'

import type { JBrowseConfig } from './types.ts'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function readJSON<T>(f: string) {
  return JSON.parse(fs.readFileSync(f, 'utf8')) as T
}

export function writeJSON(f: string, d: unknown) {
  fs.writeFileSync(f, JSON.stringify(d, undefined, 2))
}

export function splitOnFirst(str: string, sep: string) {
  const index = str.indexOf(sep)
  return index < 0
    ? ([str, ''] as const)
    : ([str.slice(0, index), str.slice(index + sep.length)] as const)
}

export function replaceLink(s: string) {
  return s
    .replaceAll('\\', ' ')
    .replaceAll('../../', 'https://genome.ucsc.edu/')
    .replaceAll('../', 'https://genome.ucsc.edu/')
    .replaceAll('"/cgi-bin', '"https://genome.ucsc.edu/cgi-bin')
}

export function readConfig(s: string) {
  try {
    return readJSON<JBrowseConfig>(s)
  } catch (e) {
    throw new Error(`Error reading config: ${s}`, { cause: e })
  }
}

export function decodeURIComponentNoThrow(uri: string) {
  try {
    return decodeURIComponent(uri)
  } catch (_e) {
    // avoid throwing exception on a failure to decode URI component
    return uri
  }
}
