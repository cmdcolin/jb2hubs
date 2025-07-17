'use client'

import { useMemo, useState } from 'react'

import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import list from './list.json'
import Container from '../components/Container.tsx'
import { StyledLink } from '../components/ui/Link.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from '../components/ui/Table.tsx'
import { H1, P } from '../components/ui/Typography.tsx'

import '../components/table.css'

export default function UCSC() {
  const [sorting, setSorting] = useState<SortingState>([])

  const data = useMemo(() => {
    return Object.entries(list.ucscGenomes).map(([key, val]) => ({
      name: key,
      scientificName: val.scientificName,
      organism: val.organism,
      description: val.description,
      jbrowseLink: `https://jbrowse.org/code/jb2/main/?config=/ucsc/${key}/config.json`,
      ucscLink2: `https://genome.ucsc.edu/cgi-bin/hgTracks?db=${key}`,
      orderKey: val.orderKey,
    }))
  }, [])

  // Define columns for TanStack Table
  const columnHelper = createColumnHelper<(typeof data)[0]>()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('scientificName', {
        header: 'Scientific name',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('organism', {
        header: 'Organism',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('description', {
        header: 'Description',
        cell: info => info.getValue(),
      }),
      columnHelper.accessor('jbrowseLink', {
        header: 'JBrowse',
        cell: info => (
          <StyledLink href={info.getValue()} external>
            JBrowse
          </StyledLink>
        ),
      }),
      columnHelper.accessor('ucscLink2', {
        header: 'UCSC',
        cell: info => (
          <StyledLink href={info.getValue()} external>
            UCSC
          </StyledLink>
        ),
      }),
    ],
    [columnHelper],
  )

  // Create table instance
  const table = useReactTable({
    data: data.sort((a, b) => a.orderKey - b.orderKey),
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <Container>
      <H1>Main UCSC browsers</H1>
      <div>
        <P>
          This page contains a list of all the &quot;main&quot; genomes from the
          UCSC genome browser, converted into a format that JBrowse 2 can load
        </P>
        <P>
          <StyledLink
            href="https://jbrowse.org/code/jb2/frozen_tracks4/?config=/ucsc/all.json"
            external
          >
            Click here
          </StyledLink>{' '}
          for single JBrowse 2 instance containing ALL the species
        </P>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(group => (
            <TableRow key={group.id}>
              {group.headers.map(header => (
                <TableHeaderCell
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className={header.column.getCanSort() ? 'cursor-pointer' : ''}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {{
                    asc: ' ↑',
                    desc: ' ↓',
                  }[header.column.getIsSorted() as string] ?? ''}
                </TableHeaderCell>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  )
}
