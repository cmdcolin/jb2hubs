import fs from 'fs'

import { parseAssemblyEntry } from 'hubtools'

import type { UCSCGenArkAssemblyEntry } from 'hubtools'

function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}
export function readJSON<T>(f: string) {
  return JSON.parse(fs.readFileSync(f, 'utf8')) as T
}
export function tryAndReadJSON<T>(f: string) {
  try {
    return readJSON(f) as T
  } catch (e) {
    return {}
  }
}
export function parseAssembliesListJson({
  data,
}: {
  data: UCSCGenArkAssemblyEntry[]
}) {
  return data
    .map(entry =>
      parseAssemblyEntry({
        entry,
      }),
    )
    .filter(notEmpty)
}

export type AssemblyData = ReturnType<typeof parseAssemblyEntry>
