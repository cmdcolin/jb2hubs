import { readConfig } from './util'

const config = readConfig(process.argv[2]!)

const items = [
  'wgEncodeGencodePolyaV',
  'wgEncodeGencodePseudoGeneV',
  'wgEncodeGencodeCompV',
  'wgEncodeGencodeBasicV',
  'wgEncodeGencode2wayConsPseudoV',
  'cloneEndABC',
]
for (const i of items) {
  const ret = config.tracks
    .filter(f => f.trackId.startsWith(i))
    .sort((a, b) => a.trackId.localeCompare(b.trackId))
  const s = new Set()
  for (let i = 0; i < ret.length - 1; i++) {
    s.add(ret[i]!.trackId)
  }
  config.tracks = config.tracks.filter(f => !s.has(f.trackId))
}

console.log(JSON.stringify(config, null, 2))
