import React, { useMemo, useState } from 'react'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import list from '../list.json'
import Container from './ui/react-wrappers/Container.jsx'
import StyledLink from './ui/react-wrappers/StyledLink.jsx'
import Table from './ui/react-wrappers/Table.jsx'
import TableBody from './ui/react-wrappers/TableBody.jsx'
import TableCell from './ui/react-wrappers/TableCell.jsx'
import TableHeader from './ui/react-wrappers/TableHeader.jsx'
import TableHeaderCell from './ui/react-wrappers/TableHeaderCell.jsx'
import TableRow from './ui/react-wrappers/TableRow.jsx'


import tableStyles from './table.module.css'

export default function UCSCTable() {
  const [sorting, setSorting] = useState([])

  const data = useMemo(() => {
    return Object.entries(list.ucscGenomes).map(([key, val]) => ({
      name: key,
      scientificName: val.scientificName,
      organism: val.organism,
      description: val.description,
      jbrowseLink: `https://jbrowse.org/code/jb2/frozen_tracks4/?config=/ucsc/${key}/config.json`,
      ucscLink2: `https://genome.ucsc.edu/cgi-bin/hgTracks?db=${key}`,
      orderKey: val.orderKey,
    }))
  }, [])

  // Define columns for TanStack Table
  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'Name',
        cell: info => (
          <div>
            {info.getValue()} (
            <StyledLink href={`/ucsc/${info.getValue()}`}>info</StyledLink>)
          </div>
        ),
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
        cell: info => <StyledLink href={info.getValue()}>JBrowse</StyledLink>,
      }),
      columnHelper.accessor('ucscLink2', {
        header: 'UCSC',
        cell: info => <StyledLink href={info.getValue()}>UCSC</StyledLink>,
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
      <h1>Main genome browsers</h1>
      <div>
        <p>
          This page contains a list of all the &quot;main&quot; genomes from the
          UCSC genome browser, converted into a format that JBrowse 2 can load
        </p>
        <p>
          <StyledLink href="https://jbrowse.org/code/jb2/frozen_tracks4/?config=/ucsc/all.json">
            Click here
          </StyledLink>{' '}
          for single JBrowse 2 instance containing ALL the species
        </p>
      </div>
      <Table className={tableStyles.ucscTable}>
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
                  }[header.column.getIsSorted()] ?? ''}
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