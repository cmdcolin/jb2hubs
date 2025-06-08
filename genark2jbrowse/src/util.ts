import fs from 'fs'

export function readJSON<T>(f: string) {
  return JSON.parse(fs.readFileSync(f, 'utf8')) as T
}
