import { readFile } from 'fs/promises'

export async function readJSON<T>(f: string) {
  return JSON.parse(await readFile(f, 'utf8')) as T
}
