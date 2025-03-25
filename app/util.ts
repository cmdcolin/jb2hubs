import path from 'node:path'
import type { APIData } from './types'
import { readJSON } from '@/generateHub/util'

function parseAssemblyEntry({
  taxId,
  asmId,
  genBank,
  refSeq,
  sciName,
  comName,
  ucscBrowser,
}: APIData) {
  const ucscAcc = path.basename(ucscBrowser)
  const accession = ucscAcc.startsWith('GC') ? ucscAcc : refSeq || genBank
  const [base, rest] = accession.split('_')
  const [b1, b2, b3] = rest.match(/.{1,3}/g)!
  const ncbiData = readJSON(
    `hubs/${base}/${b1}/${b2}/${b3}/${accession}/ncbi.json`,
  )
  const r = ncbiData.result.uids[0]
  const assemblyStatus = ncbiData.result[r].assemblystatus
  const seqReleaseDate = ncbiData.result[r].seqreleasedate
  const ncbiOrganism = ncbiData.result[r].organism
  const submitterOrg = ncbiData.result[r].submitterorganization
  const buscoStats = ncbiData.result[r].busco
  const ncbiRefSeqCategory = ncbiData.result[r].refseq_category
  const ucscBase = `https://hgdownload.soe.ucsc.edu/hubs/${base}/${b1}/${b2}/${b3}/${accession}`
  const stats = extractStats(ncbiData.result[r].meta)
  return {
    stats,
    buscoStats,
    seqReleaseDate,
    submitterOrg,
    ncbiOrganism,
    ncbiRefSeqCategory,
    accession: accession || '',
    assembly: asmId || '',
    scientificName: sciName || '',
    commonName: comName || '',
    taxonId: taxId || '',
    assemblyStatus,
    jbrowseLink: `http://jbrowse.org/code/jb2/main/?config=https://jbrowse.org/hubs/genark/${base}/${b1}/${b2}/${b3}/${accession}/config.json`,
    ncbiLink: `https://www.ncbi.nlm.nih.gov/assembly/${accession}`,
    ucscDataLink: ucscBase,
    ucscBrowserLink: ucscBrowser,
    igvBrowserLink: `https://igv.org/app/?hubURL=${ucscBase}/hub.txt`,
    ncbiName: asmId,
    ncbiBrowserLink: `https://www.ncbi.nlm.nih.gov/gdv/browser/genome/?id=${accession}`,
  }
}

function extractStats(xmlString: string) {
  const stats = {} as Record<string, any>
  const statsRegex =
    /<Stat category="([^"]+)" sequence_tag="([^"]+)">([^<]+)<\/Stat>/g
  let match

  while ((match = statsRegex.exec(xmlString)) !== null) {
    stats[match[1]] = match[3]
  }

  return stats
}

export function parseAssembliesListJson(data: { data: APIData[] }) {
  return data.data.map(d => parseAssemblyEntry(d))
}

export async function myjsonfetch(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`)
  }
  return res.json()
}

export type AssemblyData = ReturnType<typeof parseAssemblyEntry>
