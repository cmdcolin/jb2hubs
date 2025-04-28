import Link from 'next/link'

import DataTable from '../components/DataTable'

import { APIData } from '@/hubtools/src'
import { parseAssembliesListJson, readJSON } from '@/hubtools/src/util'

export default function Page({ title, raw }: { title: string; raw: string }) {
  return (
    <div>
      <Link href="/">Home</Link>
      <h1>GenArk hubs - {title}</h1>
      <DataTable
        rows={parseAssembliesListJson(
          readJSON(`${process.cwd()}/hubJson/${raw}.json`) as {
            data: APIData[]
          },
        )}
      />
    </div>
  )
}
