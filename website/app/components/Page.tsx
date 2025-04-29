import { parseAssembliesListJson, readJSON } from '@gmod/bam'
import Link from 'next/link'

import DataTable from '../components/DataTable'

import type { APIData } from '@gmod/bam'


export default function Page({ title, raw }: { title: string; raw: string }) {
  console.log({ title, raw })
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
