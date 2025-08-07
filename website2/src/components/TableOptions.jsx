import React from 'react'

import { filterCategories } from './DataTable/utils/filterCategories.js'

export default function TableOptions({
  filterOption,
  setFilterOption,
  showAllColumns,
  setShowAllColumns,
}) {
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
                setFilterOption(key)
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
              setShowAllColumns(true)
            }}
          />
          Show all columns
        </label>
      </div>
    </div>
  )
}
