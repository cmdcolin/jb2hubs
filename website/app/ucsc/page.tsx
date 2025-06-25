"use client";

import { useMemo, useState } from "react";

import {
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";

import list from "./list.json";
import Container from "../components/Container.tsx";

import "../components/table.css";

export default function UCSC() {
  const [sorting, setSorting] = useState<SortingState>([]);

  const data = useMemo(() => {
    return Object.entries(list.ucscGenomes).map(([key, val]) => ({
      name: key,
      scientificName: val.scientificName,
      organism: val.organism,
      description: val.description,
      jbrowseLink: `https://jbrowse.org/code/jb2/main/?config=/ucsc/${key}/config.json`,
      ucscLink: `https://genome.ucsc.edu/cgi-bin/hgTracks?db=${key}`,
      orderKey: val.orderKey,
    }));
  }, []);

  // Define columns for TanStack Table
  const columnHelper = createColumnHelper<(typeof data)[0]>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: "Name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("scientificName", {
        header: "Scientific name",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("organism", {
        header: "Organism",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("description", {
        header: "Description",
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("jbrowseLink", {
        header: "JBrowse",
        cell: (info) => <Link href={info.getValue()}>JBrowse</Link>,
      }),
      columnHelper.accessor("ucscLink", {
        header: "UCSC",
        cell: (info) => <Link href={info.getValue()}>UCSC</Link>,
      }),
    ],
    [columnHelper],
  );

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
  });

  return (
    <Container>
      <h1>Main UCSC browsers</h1>
      <div>
        <p>
          This page contains a list of all the "main" genomes from the UCSC
          genome browser, converted into a format that JBrowse 2 can load
        </p>
        <p>
          <Link href="https://jbrowse.org/code/jb2/frozen_tracks4/?config=/ucsc/all.json">
            Click here
          </Link>{" "}
          for single JBrowse 2 instance containing ALL the species. This is the
          instance you should use if you want to browse synteny datasets that
          compare different species
        </p>
      </div>
      <table>
        <thead>
          {table.getHeaderGroups().map((group) => (
            <tr key={group.id}>
              {group.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className={header.column.getCanSort() ? "cursor-pointer" : ""}
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                  {{
                    asc: " ↑",
                    desc: " ↓",
                  }[header.column.getIsSorted() as string] ?? ""}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Container>
  );
}
