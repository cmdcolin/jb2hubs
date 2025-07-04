import { Suspense } from 'react'

import path from 'path'

import DataTable from './DataTable.tsx'
import { readJSON } from './util.ts'

import type { AssemblyData } from './util'
import UncenteredContainer from './UncenteredContainer.tsx'

type Assemblies = AssemblyData[]

export default async function Page({
  title,
  raw,
}: {
  title: string
  raw: string
}) {
  return (
    <UncenteredContainer>
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
    </UncenteredContainer>
  )
}
