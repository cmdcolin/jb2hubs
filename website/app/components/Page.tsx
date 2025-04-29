import { notEmpty, readJSON } from 'toolshub'
import path from 'path'
import Link from 'next/link'

import DataTable from '../components/DataTable'

import type { APIData, NCBIData } from 'toolshub'

export function parseAssemblyEntry({
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
  const [b1, b2, b3] = rest!.match(/.{1,3}/g)!
  let ncbiData
  try {
    ncbiData = readJSON(
      `hubs/${base}/${b1}/${b2}/${b3}/${accession}/ncbi.json`,
    ) as {
      result: NCBIData
    }
  } catch {
    console.error(`NCBI data not found for ${accession}`)
  }
  const r = ncbiData?.result.uids[0]
  const r2 = r ? ncbiData?.result[r] : undefined
  if (!r2) {
    return undefined
  }
  const assemblyStatus = r2.assemblystatus
  const ncbiAssemblyName = r2.assemblyname
  const seqReleaseDate = r2.seqreleasedate
  const ncbiOrganism = r2.organism
  const submitterOrg = r2.submitterorganization
  const buscoStats = r2.busco
  const ncbiRefSeqCategory = r2.refseq_category
  const ucscBase = `https://hgdownload.soe.ucsc.edu/hubs/${base}/${b1}/${b2}/${b3}/${accession}`
  const stats = undefined //ncbiData ? extractStats(r2.meta) : undefined
  return {
    stats,
    buscoStats,
    seqReleaseDate,
    submitterOrg,
    ncbiOrganism,
    ncbiAssemblyName,
    ncbiRefSeqCategory,
    accession: accession || '',
    assembly: asmId || '',
    scientificName: sciName || '',
    commonName: comName || '',
    taxonId: taxId || '',
    assemblyStatus,
    jbrowseLink: `https://jbrowse.org/code/jb2/main/?config=https://jbrowse.org/hubs/genark/${base}/${b1}/${b2}/${b3}/${accession}/config.json`,
    jbrowseConfig: `https://jbrowse.org/hubs/genark/${base}/${b1}/${b2}/${b3}/${accession}/config.json`,
    ncbiLink: `https://www.ncbi.nlm.nih.gov/assembly/${accession}`,
    ucscDataLink: ucscBase,
    ucscBrowserLink: ucscBrowser,
    igvBrowserLink: `https://igv.org/app/?hubURL=${ucscBase}/hub.txt`,
    ncbiName: asmId,
    ncbiBrowserLink: `https://www.ncbi.nlm.nih.gov/gdv/browser/genome/?id=${accession}`,
  }
}

export function parseAssembliesListJson({ data }: { data: APIData[] }) {
  return data.map(d => parseAssemblyEntry(d)).filter(notEmpty)
}

export default function Page({ title, raw }: { title: string; raw: string }) {
  console.log({ title, raw })
  return (
    <div>
      <Link href="/">Home</Link>
      <h1>GenArk hubs - {title}</h1>
      <DataTable
        rows={parseAssembliesListJson(
          readJSON(`${process.cwd()}/hubJson/${raw}.json`) as {
            data: APIData[]
          },
        )}
      />
    </div>
  )
}
