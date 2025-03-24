import Link from 'next/link'
import { DataTable } from '../components/DataTable'
import { parseAssembliesListJson } from '../util'
import { readJSON } from '@/generateHub/util'

export default async function Page({
  title,
  raw,
}: {
  title: string
  raw: string
}) {
  return (
    <div>
      <Link href="/">Home</Link>
      <h1>{title}</h1>
      <DataTable
        rows={parseAssembliesListJson(
          readJSON(`${process.cwd()}/hubJson/${raw}.json`),
        )}
      />
    </div>
  )
}
