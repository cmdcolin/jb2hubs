import fs from 'node:fs'
const f = process.argv[2]

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}

fs.writeFileSync(
  `app/hubs/${f}/page.tsx`,
  `import Page from '../../components/Page'

export default function ${capitalizeFirstLetter(f)}() {
  return <Page title="${capitalizeFirstLetter(f)}" />
}`,
)
