import fs from 'fs'

import { type UCSCGenArkAssemblyEntry, parseAssemblyEntry } from 'hubtools'

function notEmpty<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined
}

export function readJSON(f: string) {
  return JSON.parse(fs.readFileSync(f, 'utf8')) as unknown
}

export function parseAssembliesListJson({
  data,
}: {
  data: UCSCGenArkAssemblyEntry[]
}) {
  return data.map(entry => parseAssemblyEntry({ entry })).filter(notEmpty)
}

export type AssemblyData = ReturnType<typeof parseAssemblyEntry>
