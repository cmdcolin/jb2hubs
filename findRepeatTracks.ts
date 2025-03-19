import fs from 'node:fs'
const file = process.argv[2]
interface Track {
  name: string
  category: string[]
}
const config = JSON.parse(fs.readFileSync(file, 'utf8')) as {
  tracks: Track[]
  assemblies: unknown[]
}
const repeats = config.tracks?.filter(
  f => f.category?.includes('varRep') && f.name === 'DNA',
)

if (repeats?.length) {
  console.log({
    file,
    repeats,
    assembly: config.assemblies[0],
  })
}
