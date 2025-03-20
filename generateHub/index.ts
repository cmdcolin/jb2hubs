import path from 'node:path'
import fs from 'node:fs'
import { myfetchtext, readJSON } from './util.ts'
import { dedupe } from '@jbrowse/core/util/dedupe.js'

const entries = dedupe(
  fs
    .readdirSync('hubJson')
    .map(file => readJSON(`hubJson/${file}`).data)
    .flat(),
  d => d.ucscBrowser,
)

for (const [idx, entry] of entries.entries()) {
  try {
    await new Promise(resolve => setTimeout(resolve, 100))
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
    console.log(`processing ${idx}/${entries.length}:`, entry)
    const ucscAcc = path.basename(ucscBrowser)
    const accession = ucscAcc.startsWith('GC') ? ucscAcc : refSeq || genBank
    const [base, rest] = accession.split('_')
    const [b1, b2, b3] = rest.match(/.{1,3}/g)!

    const hubTxt = await myfetchtext(
      `https://hgdownload.soe.ucsc.edu/hubs/${base}/${b1}/${b2}/${b3}/${accession}/hub.txt`,
    )
    const b = `hubs/${base}/${b1}/${b2}/${b3}/${accession}`
    fs.mkdirSync(b, {
      recursive: true,
    })
    fs.writeFileSync(`${b}/hub.txt`, hubTxt)
    fs.writeFileSync(
      `${b}/meta.json`,
      JSON.stringify({
        accession,
        assembly: asmId,
        scientificName: sciName,
        commonName: comName,
        taxonId: taxId,
        identical,
        genBank,
        refSeq,
      }),
    )
  } catch (e) {
    console.error(e)
  }
}
