import fs from 'fs'
import path from 'path'
import { readJSON } from './util.ts'

interface NCBIData {
  // @ts-expect-error
  uids: string[]
  [key: string]: IndexEntry
}

let entries = [] as any[]
for (const entry of process.argv.slice(2)) {
  const source = path.basename(entry, '.json')
  if (source !== 'all') {
    entries = entries.concat(
      (readJSON(entry) as { data: any[] }).data.map(t => ({
        ...t,
        source,
      })),
    )
  }
}

for (const entry of process.argv.slice(2)) {
  const source = path.basename(entry, '.json')
  if (source !== 'all') {
    fs.writeFileSync(
      'hubJson2/' + source + '.json',
      JSON.stringify(
        (readJSON(entry) as { data: any[] }).data.map(r =>
          parseAssemblyEntry(r),
        ),
        null,
        2,
      ),
    )
  }
}

function parseAssemblyEntry({
  taxId,
  asmId,
  genBank,
  refSeq,
  sciName,
  comName,
  source,
  ucscBrowser,
}: any) {
  const ucscAcc = path.basename(ucscBrowser)
  const accession = ucscAcc.startsWith('GC') ? ucscAcc : refSeq || genBank
  const [base, rest] = accession.split('_')
  const [b1, b2, b3] = rest.match(/.{1,3}/g)!
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
  const r2 = r ? ncbiData?.result[r]! : ({} as any)
  if (!r2) {
    throw new Error('failed to parse NCBI json ' + accession)
  }
  const assemblyStatus = r2.assemblystatus
  const ncbiAssemblyName = r2.assemblyname
  const seqReleaseDate = r2.seqreleasedate
  const ncbiOrganism = r2.organism
  const submitterOrg = r2.submitterorganization
  const ncbiRefSeqCategory = r2.refseq_category
  const ucscBase = `https://hgdownload.soe.ucsc.edu/hubs/${base}/${b1}/${b2}/${b3}/${accession}`
  return {
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
    ucscDataLink: ucscBase,
    ncbiName: asmId,
    source,
  }
}

fs.writeFileSync(
  'hubJson2/all.json',
  JSON.stringify(
    entries.map(r => parseAssemblyEntry(r)),
    null,
    2,
  ),
)
