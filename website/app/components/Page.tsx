import { Suspense } from 'react'

import Link from 'next/link'

import { readJSON } from './util.ts'
import DataTable from '../components/DataTable.tsx'

import type { AssemblyData } from './util'

type Assemblies = NonNullable<AssemblyData>[]

export default function Page({ title, raw }: { title: string; raw: string }) {
  return (
    <div>
      <Link href="/">Home</Link>
      <h1>GenArk hubs - {title}</h1>
      <Suspense>
        <DataTable
          rows={readJSON(`${process.cwd()}/hubJson2/${raw}.json`) as Assemblies}
        />
      </Suspense>
    </div>
  )
}
