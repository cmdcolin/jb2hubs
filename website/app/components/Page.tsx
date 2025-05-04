import Link from 'next/link'

import { parseAssembliesListJson, readJSON } from './util.ts'
import DataTable from '../components/DataTable.tsx'

import type { UCSCGenArkAssemblyEntry } from 'hubtools'

export default function Page({ title, raw }: { title: string; raw: string }) {
  return (
    <div>
      <Link href="/">Home</Link>
      <h1>GenArk hubs - {title}</h1>
      <DataTable
        rows={parseAssembliesListJson(
          readJSON(`${process.cwd()}/hubJson/${raw}.json`) as {
            data: UCSCGenArkAssemblyEntry[]
          },
        )}
      />
    </div>
  )
}
