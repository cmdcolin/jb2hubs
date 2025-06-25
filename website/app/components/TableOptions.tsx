'use client'

import React from 'react'

// Define filter categories
export const filterCategories = {
  all: 'All',
  refseq: 'RefSeq only',
  genbank: 'GenBank only',
  designatedReference: 'Designated reference only',
  hidesuppressed: 'Hide suppressed',
}

interface TableOptionsProps {
  filterOption: string | null
  setFilterOption: (
    value:
      | keyof typeof filterCategories
      | ((old: string | null) => string | null)
      | null,
    options?: object,
  ) => Promise<URLSearchParams>
  showAllColumns: boolean
  setShowAllColumns: (
    value: boolean | ((old: boolean) => boolean | null) | null,
    options?: object,
  ) => Promise<URLSearchParams>
}

export default function TableOptions({
  filterOption,
  setFilterOption,
  showAllColumns,
  setShowAllColumns,
}: TableOptionsProps) {
  return (
    <div>
      <div>
        {Object.entries(filterCategories).map(([key, val]) => (
          <label
            key={key}
            style={{
              marginRight: 15,
            }}
          >
            <input
              type="radio"
              name="databaseFilter"
              value={key}
              checked={filterOption === key}
              onChange={() => {
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                setFilterOption(key as keyof typeof filterCategories)
              }}
            />
            {val}
          </label>
        ))}
      </div>
      <div>
        <label
          style={{
            marginRight: '15px',
          }}
        >
          <input
            type="radio"
            checked={!showAllColumns}
            onChange={() => {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              setShowAllColumns(false)
            }}
          />
          Show essential columns
        </label>
        <label
          style={{
            marginRight: '15px',
          }}
        >
          <input
            type="radio"
            checked={showAllColumns}
            onChange={() => {
              // eslint-disable-next-line @typescript-eslint/no-floating-promises
              setShowAllColumns(true)
            }}
          />
          Show all columns
        </label>
      </div>
    </div>
  )
}
