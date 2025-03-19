import fs from 'fs'
import readline from 'readline'
import pkg from '@gmod/ucsc-hub'
import { nanoid } from 'nanoid'
import { myfetchtext, resolve } from './util.ts'
import { generateTracks } from './generateHubTracks.ts'

const { SingleFileHub } = pkg

const filePath = process.argv[2]

const rl = readline.createInterface({
  input: fs.createReadStream(filePath),
  crlfDelay: Infinity,
})

const asms = []
const hubs = []
for await (const line of rl) {
  if (line.startsWith('#')) {
    continue
  } else {
    const [
      accession,
      assembly,
      scientificName,
      commonName,
      taxonId,
      genArkClade,
    ] = line.split('\t')
    asms.push({
      accession,
      assembly,
      scientificName,
      commonName,
      taxonId,
      genArkClade,
    })
  }

  for (const asm of asms.slice(0, 1)) {
    const { accession } = asm
    const [base, rest] = accession.split('_')
    const [b1, b2, b3] = rest.match(/.{1,3}/g)!
    hubs.push({
      asm,
      hub: await generateConfigFromHub({
        uri: `https://hgdownload.soe.ucsc.edu/hubs/${base}/${b1}/${b2}/${b3}/${accession}/`,
        baseUri: 'http://localhost',
      }),
    })
  }
}

console.log({ hubs })
