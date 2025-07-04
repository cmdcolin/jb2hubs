import { readFile } from 'fs/promises'

/**
 * Reads a JSON file asynchronously and parses its content.
 * @param f - The path to the JSON file.
 * @returns A promise that resolves to the parsed JSON object.
 */
export async function readJSON<T>(f: string): Promise<T> {
  return JSON.parse(await readFile(f, 'utf8')) as T
}
