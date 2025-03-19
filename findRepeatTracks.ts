import fs from 'node:fs'
const file = process.argv[2]
console.log('processing:', file)

interface Track {
  name: string
  category: string[]
}
const config = JSON.parse(fs.readFileSync(file, 'utf8')) as {
  tracks: Track[]
  assemblies: unknown[]
}
const repeats = config.tracks.filter(
  f => f.category.includes('varRep') && f.name === 'DNA',
)

if (repeats.length > 0) {
  const r = JSON.parse(fs.readFileSync('r.json', 'utf8'))
  r.list.push({
    file,
    repeats,
    assembly: config.assemblies[0],
  })
  fs.writeFileSync('r.json', JSON.stringify(r, null, 2))
}
