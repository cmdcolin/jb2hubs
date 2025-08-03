import { Suspense } from 'react'

import path from 'path'

import Container2 from './Container2.tsx'
import DataTable from './DataTable.tsx'
import { H1 } from './ui/Typography.tsx'
import { readJSON } from './util.ts'

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
    <Container2>
      <H1>GenArk hubs - {title}</H1>
      <Suspense>
        <DataTable
          rows={readJSON<Assemblies>(
            path.join(process.cwd(), 'processedHubJson', `${raw}.json`),
          ).filter(f => !!f)}
        />
      </Suspense>
    </Container2>
  )
}
