'use client'
import { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'

import Link2 from '../../Link2.tsx'
import OrangeStar from '../../OrangeStar.tsx'
import RedX from '../../RedX.tsx'
import { statusOrder } from '../utils.ts'

import type { AssemblyData } from '../../util.ts'
import type { Row } from '@tanstack/react-table'

export function useTableColumns() {
  const columnHelper = createColumnHelper<NonNullable<AssemblyData>>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('commonName', {
        header: () => (
          <div>
            <div className="float-left">Common Name</div>
            <div className="float-right">
              <div>
                <OrangeStar /> == &quot;designated reference&quot;
              </div>
              <div>
                <RedX /> == &quot;refseq suppressed&quot;
              </div>
            </div>
          </div>
        ),
        cell: info => (
          <>
            {info.getValue()}{' '}
            <Link2
              href={`/accession/${info.row.original.accession}`}
              rel="noopener noreferrer"
            >
              (info)
            </Link2>{' '}
            {info.row.original.ncbiRefSeqCategory === 'reference genome' ? (
              <OrangeStar />
            ) : null}
            {info.row.original.suppressed ? <RedX /> : null}
          </>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('jbrowseLink', {
        header: 'JBrowse',
        cell: info => (
          <Link2 href={info.getValue()} rel="noopener noreferrer">
            JBrowse
          </Link2>
        ),
        enableSorting: false,
      }),

      columnHelper.accessor('assemblyStatus', {
        header: 'Assembly status',
        enableSorting: true,
        cell: info => (
          <div className="whitespace-nowrap">{info.getValue()}</div>
        ),
        sortingFn: (
          rowA: Row<NonNullable<AssemblyData>>,
          rowB: Row<NonNullable<AssemblyData>>,
        ) => {
          const a =
            statusOrder[
              rowA.original.assemblyStatus as keyof typeof statusOrder
            ] || 999
          const b =
            statusOrder[
              rowB.original.assemblyStatus as keyof typeof statusOrder
            ] || 999
          return a - b
        },
      }),
      columnHelper.accessor('submitterOrg', {
        header: 'Submitter',
        enableSorting: false,
        meta: { extra: true },
      }),
      columnHelper.accessor('seqReleaseDate', {
        header: 'Release date',
        cell: info => info.getValue().replace('00:00', ''),
        enableSorting: true,
      }),
      columnHelper.accessor('scientificName', {
        header: 'Scientific name',
        enableSorting: true,
      }),
      columnHelper.accessor('ncbiAssemblyName', {
        header: 'NCBI assembly name',
        enableSorting: true,
      }),
      columnHelper.accessor('accession', {
        header: 'Accession',
        enableSorting: true,
      }),
      columnHelper.accessor('taxonId', {
        header: 'Taxonomy ID',
        cell: info => (
          <a
            href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${info.getValue()}&lvl=3&p=nuccore&lin=f&keep=1&srchmode=1&unlock`}
          >
            {info.getValue()}
          </a>
        ),
        enableSorting: true,
        meta: { extra: true },
      }),
    ],
    [columnHelper],
  )

  return { columns }
}
