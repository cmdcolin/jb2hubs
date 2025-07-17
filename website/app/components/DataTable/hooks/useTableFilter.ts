'use client'
import { useMemo } from 'react'

import { parseAsStringLiteral, useQueryState } from 'nuqs'

import { filterCategories } from '../../TableOptions.tsx'
import { notEmpty } from '../utils.ts'

import type { AssemblyData } from '../../util.ts'

export function useTableFilter(rows: AssemblyData[]) {
  const [filterOption, setFilterOption] = useQueryState(
    'filter',
    parseAsStringLiteral(Object.keys(filterCategories)),
  )

  const filteredRows = useMemo(() => {
    const rows2 = rows.filter(notEmpty).filter(f => f.accession)
    switch (filterOption) {
      case 'all': {
        return rows2
      }
      case 'refseq': {
        return rows2.filter(r => r.ncbiName.startsWith('GCF_'))
      }
      case 'genbank': {
        return rows2.filter(r => r.ncbiName.startsWith('GCA_'))
      }
      case 'designatedReference': {
        return rows2.filter(r => r.ncbiRefSeqCategory === 'reference genome')
      }
      case 'hidesuppressed': {
        return rows2.filter(r => !r.suppressed)
      }
      default: {
        return rows2
      }
    }
  }, [rows, filterOption])

  return { filterOption, setFilterOption, filteredRows }
}
