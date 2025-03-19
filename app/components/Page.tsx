import { DataTable } from '../components/DataTable'
import styles from '../page.module.css'
import { getLines } from '../util'
import fs from 'fs'

const data = fs.readFileSync('./UCSC_GI.assemblyHubList.txt', 'utf8')

export default function ({
  title,
  filter = title.toLowerCase(),
}: {
  title: string
  filter?: string
}) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      <a href="/">Home</a>
      <DataTable
        rows={getLines(data).filter(f => f.genArkClade.startsWith(filter))}
      />
    </div>
  )
}
