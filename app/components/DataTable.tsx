'use client'

import { useState, useMemo } from 'react'

import './table.css'

// Define the type for our data
type LineData = {
  accession: string
  assembly: string
  scientificName: string
  commonName: string
  taxonId: string
  genArkClade: string
}

type DataTableProps = {
  initialData: LineData[]
}

export function DataTable({ initialData }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof LineData
    direction: 'ascending' | 'descending'
  } | null>(null)
  const [filterText, setFilterText] = useState('')

  // Function to handle sorting
  const requestSort = (key: keyof LineData) => {
    let direction: 'ascending' | 'descending' = 'ascending'
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  // Apply sorting to the data
  const sortedLines = useMemo(() => {
    let sortableLines = [...initialData]
    if (sortConfig !== null) {
      sortableLines.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableLines
  }, [initialData, sortConfig])

  // Apply filtering to the data
  const filteredLines = useMemo(() => {
    if (!filterText) return sortedLines

    return sortedLines.filter(line =>
      Object.values(line).some(value =>
        value.toLowerCase().includes(filterText.toLowerCase()),
      ),
    )
  }, [sortedLines, filterText])

  // Function to get the sort direction indicator
  const getSortDirectionIndicator = (key: keyof LineData) => {
    if (!sortConfig || sortConfig.key !== key) return null
    return sortConfig.direction === 'ascending' ? ' ↑' : ' ↓'
  }

  return (
    <>
      <div>
        <input
          type="text"
          placeholder="Filter data..."
          value={filterText}
          onChange={e => setFilterText(e.target.value)}
        />
      </div>

      <div>
        <table>
          <thead>
            <tr>
              <th onClick={() => requestSort('accession')}>
                Accession {getSortDirectionIndicator('accession')}
              </th>
              <th onClick={() => requestSort('assembly')}>
                Assembly {getSortDirectionIndicator('assembly')}
              </th>
              <th onClick={() => requestSort('scientificName')}>
                Scientific Name {getSortDirectionIndicator('scientificName')}
              </th>
              <th onClick={() => requestSort('commonName')}>
                Common Name {getSortDirectionIndicator('commonName')}
              </th>
              <th onClick={() => requestSort('taxonId')}>
                Taxon ID {getSortDirectionIndicator('taxonId')}
              </th>
              <th onClick={() => requestSort('genArkClade')}>
                GenArk Clade {getSortDirectionIndicator('genArkClade')}
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLines.map((line, index) => {
              const { accession } = line
              const [base, rest] = accession.split('_')
              const [b1, b2, b3] = rest.match(/.{1,3}/g)!
              return (
                <tr key={index}>
                  <td>{line.accession}</td>
                  <td>{line.assembly}</td>
                  <td>{line.scientificName}</td>
                  <td>{line.commonName}</td>
                  <td>{line.taxonId}</td>
                  <td>{line.genArkClade}</td>
                  <td>
                    <a
                      href={`https://jbrowse.org/code/jb2/main/?config=http://localhost:3000/hubs/${base}/${b1}/${b2}/${b3}/${accession}/config.json`}
                    >
                      JBrowse
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        {filteredLines.length === 0 && <div>No results found</div>}
      </div>
    </>
  )
}
