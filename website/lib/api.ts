import path from 'path'

import { AssemblyData, readJSON } from '../app/components/util.ts'

let accessionMap: Map<string, AssemblyData> | null = null

function loadAccessionMap() {
  if (accessionMap === null) {
    const data = readJSON<AssemblyData[]>(
      path.join(process.cwd(), 'processedHubJson', 'all.json'),
    )
    accessionMap = new Map(data.filter(f => !!f).map(f => [f.accession, f]))
  }
  return accessionMap
}

export function getAccessionById(accession: string) {
  const map = loadAccessionMap()
  return map.get(accession)
}
export function getAllAccessions() {
  const accessions = loadAccessionMap()
  return [...accessions.keys()].filter(r => !!r).map(r => ({ id: r }))
}
