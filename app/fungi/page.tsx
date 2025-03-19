import { DataTable } from '../components/DataTable'
import styles from '../page.module.css'
import { getLines } from '../util'
import fs from 'fs'

const data = fs.readFileSync('./UCSC_GI.assemblyHubList.txt', 'utf8')

export default function () {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Assembly Hub List</h1>
      <DataTable
        rows={getLines(data).filter(f => f.genArkClade.startsWith('fungi'))}
      />
    </div>
  )
}
