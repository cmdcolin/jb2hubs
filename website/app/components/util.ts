import fs from 'fs'
import { readFile } from 'fs/promises'

import { parseAssemblyEntry } from 'hubtools'

import type { UCSCGenArkAssemblyEntry } from 'hubtools'

function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export async function readJSON<T>(f: string) {
  return JSON.parse(await readFile(f, 'utf8')) as T
}

export async function tryAndReadJSON<T>(f: string) {
  try {
    return await readJSON<T>(f)
  } catch (e) {
    return {}
  }
}

export async function tryAndReadText(f: string) {
  try {
    return await readFile(f, 'utf8')
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
