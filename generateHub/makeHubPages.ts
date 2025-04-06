import fs from 'node:fs'

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}

for (const f of [
  'primates',
  'mammals',
  'birds',
  'fish',
  'vertebrate',
  'invertebrate',
  'fungi',
  'plants',
  'viral',
  'bacteria',
  'VGP',
  'CCGP',
  'HPRC',
  'BRC',
  'globalReference',
  'legacy',
]) {
  fs.mkdirSync(`app/hubs/${f}/`, {
    recursive: true,
  })
  fs.writeFileSync(
    `app/hubs/${f}/page.tsx`,
    `import Page from '../../components/Page'

export default function ${capitalizeFirstLetter(f)}() {
  return <Page title="${capitalizeFirstLetter(f)}" raw="${f}" />
}`,
  )
}
