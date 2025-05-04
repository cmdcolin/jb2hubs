import {
  parseAssemblyEntry,
  readJSON,
  type UCSCGenArkAssemblyEntry,
} from 'hubtools'

const metaPath = process.argv[2]!
console.log({ metaPath }, readJSON(metaPath))

const newConfig = parseAssemblyEntry({
  entry: readJSON(metaPath) as UCSCGenArkAssemblyEntry,
})

console.log({ newConfig })
