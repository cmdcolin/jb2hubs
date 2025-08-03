import fs from 'fs'

import { parseAssemblyEntry } from 'hubtools'

import type { UCSCGenArkAssemblyEntry } from 'hubtools'

function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function readJSON<T>(f: string) {
  return JSON.parse(fs.readFileSync(f, 'utf8')) as T
}

export async function tryAndReadJSON<T>(f: string) {
  try {
    return await readJSON<T>(f)
  } catch (e) {
    return {}
  }
}

export function tryAndReadText(f: string) {
  try {
    return fs.readFileSync(f, 'utf8')
  } catch (e) {
    return undefined
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
