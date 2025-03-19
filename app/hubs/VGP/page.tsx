import { DataTable } from '@/app/components/DataTable'
import { parseAssembliesListJson } from '@/app/util'

async function myjsonfetch(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`)
  }
  return res.json()
}
export default async function VGP() {
  const data = await myjsonfetch(
    'https://hgdownload.soe.ucsc.edu/hubs/VGP/assemblyList.json',
  )

  return <DataTable rows={parseAssembliesListJson(data)} />
}
