import { useMemo, useState } from 'react'

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { StyledLink } from './ui/react-wrappers/Link.jsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from './ui/react-wrappers/Table.jsx'

export default function UCSCTable({ list }) {
  const [sorting, setSorting] = useState([])

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
  )
}
