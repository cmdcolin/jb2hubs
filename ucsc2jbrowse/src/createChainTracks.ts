import fs from 'fs'
import os from 'os'
import path from 'path'

import { Command } from 'commander'

import { readJSON, writeJSON } from './util.ts'

interface ChainTrack {
  type: string
  trackId: string
  name: string
  category: string[]
  assemblyNames: string[]
  adapter: {
    type: string
    targetAssembly: string
    queryAssembly: string
    pifGzLocation: { uri: string }
    index: { location: { uri: string }; indexType?: string }
  }
}

interface JBrowseConfig {
  tracks: any[]
}

function main() {
  const program = new Command()

  program
    .option(
      '-a, --assembly <assembly>',
      'Source assembly name (e.g., hg19, hg38, mm10)',
    )
    .option(
      '-s, --source <source_dir>',
      'Either ${srcDir} or vs, the source dir',
    )
    .option(
      '-o, --output <dir>',
      'Output directory',
      path.join(os.homedir(), 'ucscResults'),
    )
    .parse(process.argv)

  const options = program.opts()
  const sourceAssembly = options.assembly
  const outDir = options.output
  const srcDir = options.source

  const configDir = path.join(outDir, sourceAssembly)
  const configFile = path.join(configDir, 'config.json')

  if (!fs.existsSync(configFile)) {
    writeJSON(configFile, { tracks: [] })
  }

  const liftoverDir = path.join(configDir, srcDir)
  const pifFiles = fs
    .readdirSync(liftoverDir)
    .filter(file => file.endsWith('.pif.gz'))

  if (pifFiles.length === 0) {
    console.log(`No PIF files found in ${liftoverDir}`)
    return
  }

  const chainTracks: ChainTrack[] = []

  for (const pifFile of pifFiles) {
    const track = createChainTrackConfig(pifFile, sourceAssembly, srcDir)
    if (track) {
      chainTracks.push(track)
    }
  }

  const config = readJSON<JBrowseConfig>(configFile)
  writeJSON(configFile, {
    ...config,
    tracks: [...config.tracks, ...chainTracks],
  })
}

function createChainTrackConfig(
  pifFile: string,
  sourceAssembly: string,
  srcDir: string,
) {
  const filename = path.basename(pifFile)
  const filename2 = filename.replace('.pif.gz', '')

  const match = /^(.+?)To(.+?)\.over$/.exec(filename2)
  if (!match?.[1] || !match[2]) {
    console.warn(`Warning: Could not parse filename format for ${filename}`)
    return null
  }

  const targetAssemblyOrig = match[2]
  let targetAssembly: string

  if (
    targetAssemblyOrig.startsWith('GCF') ||
    targetAssemblyOrig.startsWith('GCA')
  ) {
    targetAssembly = targetAssemblyOrig
  } else {
    targetAssembly =
      targetAssemblyOrig.charAt(0).toLowerCase() + targetAssemblyOrig.slice(1)
  }

  let commonName = ''
  if (
    targetAssemblyOrig.startsWith('GCF') ||
    targetAssemblyOrig.startsWith('GCA')
  ) {
    try {
      const allJson = readJSON<any>('../website/processedHubJson/all.json')
      const assembly = allJson.find(
        (a: any) => a?.accession === targetAssemblyOrig,
      )
      commonName = assembly?.commonName ?? ''
    } catch (error) {
      console.warn(
        `Warning: Could not read assembly information for ${targetAssemblyOrig}: ${error}`,
      )
    }
  } else {
    try {
      const listJson = readJSON<any>(
        path.join(os.homedir(), 'ucscResults', 'list.json'),
      )
      commonName = listJson.ucscGenomes?.[targetAssembly]?.organism ?? ''
    } catch (error) {
      console.warn(
        `Warning: Could not read organism information for ${targetAssembly}`,
      )
    }
  }

  const trackId = `${sourceAssembly}_to_${targetAssembly}_chain`
  const trackName = commonName
    ? `${sourceAssembly} to ${commonName} (${targetAssembly}) ${srcDir} chain`
    : `${sourceAssembly} to ${targetAssembly} ${srcDir} chain`

  return {
    type: 'SyntenyTrack',
    trackId,
    name: trackName,
    category: ['Liftover'],
    assemblyNames: [sourceAssembly, targetAssembly],
    adapter: {
      type: 'PairwiseIndexedPAFAdapter',
      targetAssembly: sourceAssembly,
      queryAssembly: targetAssembly,
      pifGzLocation: { uri: `${srcDir}/${filename}` },
      index: {
        location: { uri: `${srcDir}/${filename}.csi` },
        indexType: 'CSI',
      },
    },
  }
}

main()
