import fs from 'fs'

export function readJSON(f: string) {
  return JSON.parse(fs.readFileSync(f, 'utf8')) as unknown
}
