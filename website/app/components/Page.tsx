import { Suspense } from 'react'

import path from 'path'

import { readJSON } from './util.ts'
import DataTable from './DataTable.tsx'

import type { AssemblyData } from './util'

type Assemblies = AssemblyData[]

export default async function Page({
  title,
  raw,
}: {
  title: string
  raw: string
}) {
  return (
    <div>
      <h1>GenArk hubs - {title}</h1>
      <Suspense>
        <DataTable
          rows={(
            await readJSON<Assemblies>(
              path.join(process.cwd(), 'processedHubJson', `${raw}.json`),
            )
          ).filter(f => !!f)}
        />
      </Suspense>
    </div>
  )
}
