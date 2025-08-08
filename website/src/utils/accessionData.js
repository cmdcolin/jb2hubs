import fs from 'fs'
import path from 'path'

/**
 * @typedef {object} AssemblyData
 * @property {string} accession
 * @property {string} scientificName
 * @property {string} ncbiAssemblyName
 * @property {string} commonName
 * @property {string} jbrowseLink
 * @property {string} igvBrowserLink
 * @property {string} ncbiBrowserLink
 * @property {string} ucscBrowserLink
 * @property {string} ucscDataLink
 * @property {string} ncbiLink
 * @property {number} taxonId
 * // Add other properties of AssemblyData if known and needed for type safety
 * [key: string]: any; // Allow other properties
 */

let accessionMap = null

/**
 * Loads and caches the accession data from all.json.
 * @returns {Map<string, AssemblyData>}
 */
export function loadAccessionMap() {
  if (accessionMap === null) {
    accessionMap = new Map(
      JSON.parse(
        fs.readFileSync(path.join('processedHubJson', 'all.json'), 'utf-8'),
      )
        .filter(f => !!f && f.accession)
        .map(f => [f.accession, f]),
    )
  }
  return accessionMap
}

/**
 * Safely reads and parses a JSON file.
 * @template T
 * @param {string} filePath
 * @returns {Promise<T | null>}
 */
export function tryAndReadJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  } catch (error) {
    // console.error(`Error reading or parsing JSON from ${filePath}:`, error);
    return null
  }
}
