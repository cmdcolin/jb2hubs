import { Suspense } from 'react'

import path from 'path'

import Container from './Container.tsx'
import DataTable from './DataTable.tsx'
import { readJSON } from './util.ts'
import { H1 } from './ui/Typography'

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
    <Container className="w-7/8">
      <H1>GenArk hubs - {title}</H1>
      <Suspense>
        <DataTable
          rows={(
            await readJSON<Assemblies>(
              path.join(process.cwd(), 'processedHubJson', `${raw}.json`),
            )
          ).filter(f => !!f)}
        />
      </Suspense>
    </Container>
  )
}
