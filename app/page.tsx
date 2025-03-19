import styles from './page.module.css'
import fs from 'fs'
import { DataTable } from './components/DataTable'

const data = fs.readFileSync('./UCSC_GI.assemblyHubList.txt', 'utf8')
export default function Home() {
  const lines = data
    .split('\n')
    .map(l => l.trim())
    .filter(line => !!line)
    .filter(line => !line.startsWith('#'))
    .map(line => {
      const [
        accession,
        assembly,
        scientificName,
        commonName,
        taxonId,
        genArkClade,
      ] = line.split('\t')
      return {
        accession: accession || '',
        assembly: assembly || '',
        scientificName: scientificName || '',
        commonName: commonName || '',
        taxonId: taxonId || '',
        genArkClade: genArkClade || '',
      }
    })

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Assembly Hub List</h1>
      <DataTable initialData={lines} />
    </div>
  )
}
