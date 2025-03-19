import Link from 'next/link'
import { DataTable } from '../components/DataTable'
import styles from '../page.module.css'
import { myjsonfetch, parseAssembliesListJson } from '../util'

export default async function ({ title, raw }: { title: string; raw: string }) {
  const data = await myjsonfetch(
    `https://hgdownload.soe.ucsc.edu/hubs/${raw}/assemblyList.json`,
  )
  return (
    <div className={styles.container}>
      <Link href="/">Home</Link>
      <h1 className={styles.title}>{title}</h1>
      <DataTable rows={parseAssembliesListJson(data)} />
    </div>
  )
}
