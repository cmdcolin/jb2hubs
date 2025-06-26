"use client";

import { useMemo } from "react";

import {
  type Row,
  type SortingState,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import Link from "next/link";
import {
  parseAsBoolean,
  parseAsString,
  parseAsStringLiteral,
  useQueryState,
} from "nuqs";

import "./table.css";
import TableOptions from "./TableOptions";

import type { AssemblyData } from "./util";

const statusOrder = {
  "Complete Genome": 1,
  "Complete genome": 1,
  Chromosome: 2,
  Scaffold: 3,
  Contig: 4,
};

function OrangeStar() {
  return <Star fill="orange" strokeWidth={0} className="w-[1em] h-[1em]" />;
}

function RedX() {
  return <X stroke="red" className="w-[1em] h-[1em]" />;
}

// Import filterCategories from TableOptions
import { filterCategories } from "./TableOptions";
import { Star, X } from "lucide-react";

// List accepted values
const sortOrder = ["asc", "desc", ""] as const;

export default function DataTable({
  rows,
}: {
  rows: NonNullable<AssemblyData>[];
}) {
  const [sortState, setSortState] = useQueryState(
    "sort",
    parseAsString.withDefault(""),
  );

  const [sortDirectionPre, setSortDirection] = useQueryState(
    "dir",
    parseAsStringLiteral(sortOrder),
  );

  const [filterOption, setFilterOption] = useQueryState(
    "filter",
    parseAsStringLiteral(Object.keys(filterCategories)),
  );

  const [showAllColumns, setShowAllColumns] = useQueryState(
    "show",
    parseAsBoolean.withDefault(false),
  );

  // Convert URL query params to TanStack table sorting state
  const sorting = useMemo<SortingState>(() => {
    if (sortState && sortDirectionPre) {
      return [
        {
          id: sortState,
          desc: sortDirectionPre === "desc",
        },
      ];
    }
    return [];
  }, [sortState, sortDirectionPre]);

  // Update URL query params when sorting changes
  const onSortingChange = (
    updater: ((state: SortingState) => SortingState) | SortingState,
  ) => {
    const newSorting = updater instanceof Function ? updater(sorting) : updater;

    if (newSorting.length === 0) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortState("");
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortDirection("");
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortState(newSorting[0]?.id ?? "");
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortDirection(newSorting[0]?.desc ? "desc" : "asc");
    }
  };

  const filteredRows = useMemo(() => {
    switch (filterOption) {
      case "all": {
        return rows;
      }
      case "refseq": {
        return rows.filter((r) => r.ncbiName.startsWith("GCF_"));
      }
      case "genbank": {
        return rows.filter((r) => r.ncbiName.startsWith("GCA_"));
      }
      case "designatedReference": {
        return rows.filter((r) => r.ncbiRefSeqCategory === "reference genome");
      }
      case "hidesuppressed": {
        return rows.filter((r) => !r.suppressed);
      }
      default: {
        return rows;
      }
    }
  }, [rows, filterOption]);

  // Define columns for TanStack Table
  const columnHelper = createColumnHelper<NonNullable<AssemblyData>>();

  const columns = useMemo(
    () => [
      columnHelper.accessor("commonName", {
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
        cell: (info) => (
          <>
            {info.getValue()}{" "}
            <Link
              href={`/accession/${info.row.original.accession}`}
              rel="noopener noreferrer"
            >
              (info)
            </Link>{" "}
            {info.row.original.ncbiRefSeqCategory === "reference genome" ? (
              <OrangeStar />
            ) : null}
            {info.row.original.suppressed ? <RedX /> : null}
          </>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor("jbrowseLink", {
        header: "JBrowse",
        cell: (info) => (
          <Link href={info.getValue()} rel="noopener noreferrer">
            JBrowse
          </Link>
        ),
        enableSorting: false,
      }),

      columnHelper.accessor("assemblyStatus", {
        header: "Assembly status",
        enableSorting: true,
        cell: (info) => (
          <div className="whitespace-nowrap">{info.getValue()}</div>
        ),
        sortingFn: (
          rowA: Row<NonNullable<AssemblyData>>,
          rowB: Row<NonNullable<AssemblyData>>,
        ) => {
          const a =
            statusOrder[
              rowA.original.assemblyStatus as keyof typeof statusOrder
            ] || 999;
          const b =
            statusOrder[
              rowB.original.assemblyStatus as keyof typeof statusOrder
            ] || 999;
          return a - b;
        },
      }),
      columnHelper.accessor("submitterOrg", {
        header: "Submitter",
        enableSorting: false,
        meta: { extra: true },
      }),
      columnHelper.accessor("seqReleaseDate", {
        header: "Release date",
        cell: (info) => info.getValue().replace("00:00", ""),
        enableSorting: true,
      }),
      columnHelper.accessor("scientificName", {
        header: "Scientific name",
        enableSorting: true,
      }),
      columnHelper.accessor("ncbiAssemblyName", {
        header: "NCBI assembly name",
        enableSorting: true,
      }),
      columnHelper.accessor("accession", {
        header: "Accession",
        enableSorting: true,
      }),
      columnHelper.accessor("taxonId", {
        header: "Taxonomy ID",
        cell: (info) => (
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
  );

  // Create table instance
  const table = useReactTable({
    data: filteredRows,
    columns: columns.filter(
      (col) =>
        showAllColumns || !(col.meta as { extra?: boolean } | undefined)?.extra,
    ),
    state: {
      sorting,
    },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  // Function to handle sort
  const handleSort = (columnId: string) => {
    if (sortState === columnId) {
      // Toggle direction if already sorting by this column
      if (sortDirectionPre === "asc") {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortDirection("desc");
      } else if (sortDirectionPre === "desc") {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortDirection("");
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortState("");
      } else {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        setSortDirection("asc");
      }
    } else {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortState(columnId);
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      setSortDirection("asc");
    }
  };

  return (
    <>
      <TableOptions
        filterOption={filterOption}
        setFilterOption={setFilterOption}
        showAllColumns={showAllColumns}
        setShowAllColumns={setShowAllColumns}
      />

      <div>
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={
                      header.column.getCanSort() ? "cursor-pointer" : ""
                    }
                    onClick={
                      header.column.getCanSort()
                        ? () => {
                            handleSort(header.id);
                          }
                        : undefined
                    }
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}{" "}
                    {header.column.getCanSort()
                      ? sortState === header.id
                        ? sortDirectionPre === "asc"
                          ? "↑"
                          : "↓"
                        : ""
                      : ""}
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
      </div>
    </>
  );
}
