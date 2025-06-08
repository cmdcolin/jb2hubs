import path from 'path'

import { AssemblyData, readJSON } from '../app/components/util.ts'

function timer<T>(label: string, cb: () => T): T {
  console.time(label)
  const ret = cb()
  console.timeEnd(label)
  return ret
}

let j = 0
export async function getAccessionById(accession: string) {
  return timer(`getAccessionById ${j++} ${accession}`, () =>
    readJSON<AssemblyData[]>(
      path.join(process.cwd(), 'processedHubJson', 'all.json'),
    )
      .filter(f => !!f)
      .find(f => f.accession === accession),
  )
}
let i = 0
export async function getAllAccessions() {
  return timer(`getAllAccessions ${i++}`, () =>
    readJSON<({ accession: string; speciesName: string } | null)[]>(
      path.join(process.cwd(), 'processedHubJson', 'all.json'),
    )
      .filter(f => !!f)
      .map(entry => ({ id: entry.accession })),
  )
}
