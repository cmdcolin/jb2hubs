import fs from 'fs'
import zlib from 'zlib'

import { getColNames } from './utils/getColNames.ts'
import { parseTableLine } from './utils/parseTableLine.ts'

/**
 * Parses a buffer line by line and applies a callback function.
 * Handles multi-line entries that are split by a backslash.
 * @param buffer The Uint8Array buffer to parse.
 * @param cb The callback function to apply to each line.
 */
function parseLineByLine(buffer: Uint8Array, cb: (line: string) => void) {
  let blockStart = 0
  const decoder = new TextDecoder('utf8')
  let currentLine = ''

  while (blockStart < buffer.length) {
    const newlineIndex = buffer.indexOf(10, blockStart) // Find newline character (LF)
    const lineEnd = newlineIndex === -1 ? buffer.length : newlineIndex
    const lineBuffer = buffer.slice(blockStart, lineEnd)
    blockStart = lineEnd + 1

    const decodedLine = decoder.decode(lineBuffer).trim()

    if (decodedLine.endsWith('\\')) {
      // If line ends with a backslash, it's a continuation
      currentLine += decodedLine.slice(0, -1) + ' ' // Remove backslash and add space
    } else {
      // Process the complete line
      cb((currentLine + decodedLine).replace(/\r/g, '\\r'))
      currentLine = '' // Reset for next line
    }
  }
  // Process any remaining content in currentLine after loop finishes
  if (currentLine) {
    cb(currentLine.replace(/\r/g, '\\r'))
  }
}

/**
 * Generates a BED12-like output from a SQL schema file and a gzipped text file.
 * @param sqlFilePath The path to the SQL schema file.
 * @param txtGzFilePath The path to the gzipped text file.
 */
function generateBed12(sqlFilePath: string, txtGzFilePath: string) {
  const cols = getColNames(fs.readFileSync(sqlFilePath, 'utf8'))
  const gzippedContent = fs.readFileSync(txtGzFilePath)
  const unzippedContent = zlib.gunzipSync(gzippedContent)

  parseLineByLine(unzippedContent, line => {
    const {
      chrom,
      txStart,
      score,
      name,
      name2,
      strand,
      txEnd,
      exonStarts,
      cdsStart,
      cdsEnd,
      exonEnds,
    } = parseTableLine(line, cols.colNames)

    const starts = exonStarts
      ?.split(',')
      .filter(f => !!f)
      .map(r => +r - +txStart!)

    const ends = exonEnds
      ?.split(',')
      .filter(f => !!f)
      .map(r => +r - +txStart!)

    const sizes: number[] = []
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
        name2,
      ].join('\t') + '\n',
    )
  })
}

if (require.main === module) {
  if (process.argv.length !== 4) {
    console.error('Usage: ts-node geneLike.ts <sqlFile> <txtGzFile>')
    process.exit(1)
  }

  generateBed12(process.argv[2], process.argv[3])
}
