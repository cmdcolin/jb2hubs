import fs from 'fs'
import readline from 'readline'
import zlib from 'zlib'

import { getColNames } from './utils/getColNames.ts'
import { parseTableLine } from './utils/parseTableLine.ts'

/**
 * Processes a SQL schema file and a gzipped text file to generate a BED-like output
 * for VCF-like data (specifically gene prediction tracks with exon information).
 * @param sqlFilePath The path to the SQL schema file.
 * @param txtGzFilePath The path to the gzipped text file containing VCF-like data.
 */
async function processVcfLikeData(sqlFilePath: string, txtGzFilePath: string) {
  const sqlContent = fs.readFileSync(sqlFilePath, 'utf8')
  const { colNames } = getColNames(sqlContent)

  const rl = readline.createInterface({
    input: fs.createReadStream(txtGzFilePath).pipe(zlib.createGunzip()),
  })

  for await (const line of rl) {
    const {
      chrom,
      txStart,
      score,
      name,
      strand,
      txEnd,
      exonStarts,
      cdsStart,
      cdsEnd,
      exonEnds,
    } = parseTableLine(line, colNames)

    const sizes: number[] = []
    const starts = exonStarts
      ?.split(',')
      .filter(f => !!f)
      .map(r => +r - +txStart!)
    const ends = exonEnds
      ?.split(',')
      .filter(f => !!f)
      .map(r => +r - +txStart!)

    if (starts && ends) {
      for (let i = 0; i < starts.length; i++) {
        sizes.push(ends[i]! - starts[i]!)
      }
    }

    process.stdout.write(
      [
        chrom,
        txStart,
        txEnd,
        name,
        score,
        strand,
        cdsStart,
        cdsEnd,
        '0,0,0',
        starts?.length ?? 0,
        sizes.join(','),
        starts?.join(','),
      ].join('\t') + '\n',
    )
  }
}

if (require.main === module) {
  if (process.argv.length !== 4) {
    console.error('Usage: ts-node vcfLike.ts <sqlFile> <txtGzFile>')
    process.exit(1)
  }

  void processVcfLikeData(process.argv[2], process.argv[3])
}
