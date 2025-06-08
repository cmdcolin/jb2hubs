import path from 'path'
import { readJSON, tryAndReadJSON } from '../app/components/util'

function timer<T>(label: string, cb: () => T): T {
  console.time(label)
  const ret = cb()
  console.timeEnd(label)
  return ret
}

let j = 0
export async function getAccessionById(accession: string) {
  const [base, rest] = accession.split('_')
  const [b1, b2, b3] = rest!.match(/.{1,3}/g)!
  const folder = `hubs/${base}/${b1}/${b2}/${b3}/${accession}`

  console.log(path.join(process.cwd(), folder, 'description.json'))
  return timer(`getAccessionById ${j++} ${accession}`, () => ({
    ...readJSON<{ accession: string; scientificName: string }>(
      path.join(process.cwd(), folder, 'meta.json'),
    ),
    ...tryAndReadJSON<{ description: string }>(
      path.join(process.cwd(), folder, 'description.json'),
    ),
  }))
}
let i = 0
export async function getAllAccessions() {
  return timer(`getAllAccessions ${i++}`, () =>
    readJSON<{ accession: string; speciesName: string }[]>(
      path.join(process.cwd(), 'processedHubJson', 'all.json'),
    )
      .filter(f => !!f)
      .map(entry => ({ id: entry.accession })),
  )
}
