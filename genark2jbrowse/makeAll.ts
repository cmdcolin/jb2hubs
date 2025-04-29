import fs from 'node:fs'
import path from 'node:path'

import { dedupe , myfetchtext, readJSON } from 'hubtools'

interface Entry {
  taxId: string
  asmId: string
  genBank: string
  refSeq: string
  identical: string
  sciName: string
  comName: string
  ucscBrowser: string
}

const entries = dedupe(
  fs.readdirSync('hubJson').flatMap(
    f =>
      (
        readJSON(`hubJson/${f}`) as {
          data: Entry[]
        }
      ).data,
  ),
  d => d.ucscBrowser,
)

async function processEntry(entry: Entry, idx: number, totalEntries: number) {
  const {
    taxId,
    asmId,
    genBank,
    refSeq,
    identical,
    sciName,
    comName,
    ucscBrowser,
  } = entry
  const ucscAcc = path.basename(ucscBrowser)
  const accession = ucscAcc.startsWith('GC') ? ucscAcc : refSeq || genBank
  const [base, rest] = accession.split('_')
  const [b1, b2, b3] = rest!.match(/.{1,3}/g)!

  const b = `hubs/${base}/${b1}/${b2}/${b3}/${accession}`
  const metaFile = `${b}/meta.json`
  const hubFile = `${b}/hub.txt`

  if (fs.existsSync(hubFile)) {
    // console.log(
    //   `Skipping ${idx}/${totalEntries}: ${accession} (already exists)`,
    // )
    return
  }
  console.log(`Processing ${idx}/${totalEntries}:`, entry, metaFile)

  await new Promise(resolve => setTimeout(resolve, 100))
  const hubFileLocation = `https://hgdownload.soe.ucsc.edu/hubs/${base}/${b1}/${b2}/${b3}/${accession}/hub.txt`
  const hubTxt = await myfetchtext(hubFileLocation)

  fs.mkdirSync(b, {
    recursive: true,
  })
  fs.writeFileSync(hubFile, hubTxt)
  fs.writeFileSync(
    metaFile,
    JSON.stringify({
      accession,
      assembly: asmId,
      scientificName: sciName,
      commonName: comName,
      taxonId: taxId,
      identical,
      genBank,
      refSeq,
      hubFileLocation,
    }),
  )
}

for (const [idx, entry] of entries.entries()) {
  try {
    await processEntry(entry, idx, entries.length)
  } catch (e) {
    // some 404 exist in the list, just log and continue
    console.error(e)
  }
}
