'use client'
import { useMemo } from 'react'

import { parseAsStringLiteral, useQueryState } from 'nuqs'

import { filterCategories } from '../../TableOptions.tsx'
import { notEmpty } from '../utils.ts'

import type { AssemblyData } from '../../util.ts'

export function useCategoryFilter(rows: AssemblyData[]) {
  const [filterOption, setFilterOption] = useQueryState(
    'filter',
    parseAsStringLiteral(Object.keys(filterCategories)),
  )

  const filteredRows = useMemo(() => {
    const validRows = rows.filter(notEmpty).filter(f => f.accession)
    
    switch (filterOption) {
      case 'all': {
        return validRows
      }
      case 'refseq': {
        return validRows.filter(r => r.ncbiName.startsWith('GCF_'))
      }
      case 'genbank': {
        return validRows.filter(r => r.ncbiName.startsWith('GCA_'))
      }
      case 'designatedReference': {
        return validRows.filter(r => r.ncbiRefSeqCategory === 'reference genome')
      }
      case 'hidesuppressed': {
        return validRows.filter(r => !r.suppressed)
      }
      default: {
        return validRows
      }
    }
  }, [rows, filterOption])

  return { filterOption, setFilterOption, filteredRows }
}