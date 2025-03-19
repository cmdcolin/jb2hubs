import fs from 'node:fs'
import readline from 'node:readline'
import { myfetchtext } from './util.ts'

const filePath = process.argv[2]

const rl = readline.createInterface({
  input: fs.createReadStream(filePath),
})

for await (const line of rl) {
  if (line.startsWith('#')) {
    continue
  } else {
    await new Promise(resolve => setTimeout(resolve, 100))
    const [
      accession,
      assembly,
      scientificName,
      commonName,
      taxonId,
      genArkClade,
    ] = line.split('\t')
    console.log('processing:', line)
    const [base, rest] = accession.split('_')
    const [b1, b2, b3] = rest.match(/.{1,3}/g)!

    const url = `https://hgdownload.soe.ucsc.edu/hubs/${base}/${b1}/${b2}/${b3}/${accession}/hub.txt`
    const hubTxt = await myfetchtext(url)
    const b = `hubs/${base}/${b1}/${b2}/${b3}/${accession}`
    fs.mkdirSync(b, { recursive: true })
    fs.writeFileSync(`${b}/hub.txt`, hubTxt)
    fs.writeFileSync(
      `${b}/meta.json`,
      JSON.stringify({
        accession,
        assembly,
        scientificName,
        commonName,
        taxonId,
        genArkClade,
        hubFileLocation: url,
      }),
    )
  }
}
