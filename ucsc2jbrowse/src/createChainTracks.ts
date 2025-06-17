import { execSync } from 'child_process'
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

/**
 * Script to generate chain tracks for a specified assembly
 * Downloads chain files, converts to PAF, creates PIF files, and adds to JBrowse config
 */
async function main() {
  const program = new Command()

  program
    .option(
      '-a, --assembly <assembly>',
      'Source assembly name (e.g., hg19, hg38, mm10)',
      'hg19',
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

  const configDir = path.join(outDir, sourceAssembly)
  const configFile = path.join(configDir, 'config.json')

  // Create output directories
  fs.mkdirSync(configDir, { recursive: true })
  fs.mkdirSync('chains', { recursive: true })
  fs.mkdirSync('pifs', { recursive: true })
  fs.mkdirSync(path.join(configDir, 'liftOver'), { recursive: true })

  // Create config file with empty tracks array if it doesn't exist
  if (!fs.existsSync(configFile)) {
    writeJSON(configFile, { tracks: [] })
  }

  // Get list of chain files
  const chainFiles = await getChainFiles(sourceAssembly)

  if (chainFiles.length === 0) {
    console.log(`No chain files found for ${sourceAssembly}`)
    return
  }

  // Process chain files
  const chainTracks: ChainTrack[] = []

  for (const chainUrl of chainFiles) {
    const track = await processChainFile(chainUrl, sourceAssembly, configDir)
    if (track) {
      chainTracks.push(track)
    }
  }

  // Update config file with chain tracks
  const config = readJSON<JBrowseConfig>(configFile)
  writeJSON(configFile, {
    ...config,
    tracks: [...config.tracks, ...chainTracks],
  })
}

/**
 * Get list of chain files for a given assembly
 */
async function getChainFiles(sourceAssembly: string): Promise<string[]> {
  const url = `https://hgdownload.soe.ucsc.edu/goldenPath/${sourceAssembly}/liftOver/`

  try {
    // Use execSync to run wget and grep to get chain files
    const result = execSync(
      `wget -q -O - "${url}" | grep -o 'href="[^"]*"' | sed "s!href=\\"\\(.*\\)\\"!${url}\\1!" | grep -v md5sum | grep .chain.gz`,
    )
      .toString()
      .trim()

    // Split the result into lines to get individual URLs
    return result.split('\n')
  } catch (error) {
    console.error(`Error fetching chain files: ${error}`)
    return []
  }
}

/**
 * Process a single chain file
 */
async function processChainFile(
  chainUrl: string,
  sourceAssembly: string,
  configDir: string,
): Promise<ChainTrack | null> {
  try {
    // Extract the filename from the URL
    const filename = path.basename(chainUrl)
    const filename2 = filename.replace('.chain.gz', '')

    // Download only if the file doesn't exist
    const chainPath = path.join('chains', filename)
    if (!fs.existsSync(chainPath)) {
      console.log(`Downloading ${chainUrl}...`)
      execSync(
        `wget -q -O "${chainPath}.tmp" "${chainUrl}" && mv "${chainPath}.tmp" "${chainPath}"`,
      )
    }

    // Create pif file if it does not exist
    const pifPath = path.join('pifs', `${filename2}.pif.gz`)
    if (!fs.existsSync(pifPath)) {
      console.log(`Creating PIF file for ${filename}...`)
      const pafPath = path.join(os.tmpdir(), `${filename}.paf`)

      // Convert chain to PAF
      execSync(
        `pigz -dc "${chainPath}" | chain2paf --input /dev/stdin > "${pafPath}"`,
      )

      // Create PIF file
      execSync(`jbrowse make-pif "${pafPath}" --csi --out "${pifPath}"`)

      // Clean up temporary PAF file
      fs.unlinkSync(pafPath)
    }

    // Copy PIF files to config directory
    fs.copyFileSync(
      pifPath,
      path.join(configDir, 'liftOver', path.basename(pifPath)),
    )
    fs.copyFileSync(
      `${pifPath}.csi`,
      path.join(configDir, 'liftOver', `${path.basename(pifPath)}.csi`),
    )

    // Parse the filename to get the source and target assemblies
    const match = /^(.+?)To(.+?)\.over\.chain\.gz$/.exec(filename)
    if (!match?.[1] || !match[2]) {
      console.warn(`Warning: Could not parse filename format for ${filename}`)
      return null
    }

    const targetAssemblyOrig = match[2]
    let targetAssembly: string

    // Ensure first letter is lowercase for target assembly
    if (
      targetAssemblyOrig.startsWith('GCF') ||
      targetAssemblyOrig.startsWith('GCA')
    ) {
      targetAssembly = targetAssemblyOrig
    } else {
      targetAssembly =
        targetAssemblyOrig.charAt(0).toLowerCase() + targetAssemblyOrig.slice(1)
    }

    // Get common name for the target assembly
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
        commonName = assembly?.commonName || ''
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
        commonName = listJson.ucscGenomes?.[targetAssembly]?.organism || ''
      } catch (error) {
        console.warn(
          `Warning: Could not read organism information for ${targetAssembly}`,
        )
      }
    }

    // Create track ID and name
    const trackId = `${sourceAssembly}_to_${targetAssembly}_chain`
    const trackName = commonName
      ? `${sourceAssembly} to ${commonName} (${targetAssembly}) liftOver chain`
      : `${sourceAssembly} to ${targetAssembly} liftOver chain`

    // Create the track configuration
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
        pifGzLocation: { uri: `liftOver/${filename2}.pif.gz` },
        index: {
          location: { uri: `liftOver/${filename2}.pif.gz.csi` },
          indexType: 'CSI',
        },
      },
    }
  } catch (error) {
    console.error(`Error processing chain file ${chainUrl}: ${error}`)
    return null
  }
}

// Run the main function
main().catch(error => {
  console.error(`Error: ${error}`)
  process.exit(1)
})
