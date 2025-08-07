import { useMemo } from 'react'

import { createColumnHelper } from '@tanstack/react-table'

import OrangeStar from '../../OrangeStar.jsx'
import RedX from '../../RedX.jsx'
import { StyledLink } from '../../ui/react-wrappers/Link.jsx'
import { statusOrder } from '../utils.js'
import { highlightText } from '../utils/highlightText.jsx'
import styles from './useTableColumns.module.css'

export function useTableColumns({ searchQuery = '' } = {}) {
  const columnHelper = createColumnHelper()

  const columns = useMemo(
    () => [
      columnHelper.accessor('commonName', {
        header: () => (
          <div>
            <div className={styles.floatLeft}>Common Name</div>
            <div className={styles.floatRight}>
              <div>
                <OrangeStar /> == &quot;designated reference&quot;
              </div>
              <div>
                <RedX /> == &quot;refseq suppressed&quot;
              </div>
            </div>
          </div>
        ),
        cell: info => (
          <>
            {highlightText(info.getValue() || '', searchQuery)}{' '}
            <StyledLink
              href={`/accession/${info.row.original.accession}`}
              rel="noopener noreferrer"
            >
              (info)
            </StyledLink>{' '}
            {info.row.original.ncbiRefSeqCategory === 'reference genome' ? (
              <OrangeStar />
            ) : null}
            {info.row.original.suppressed ? <RedX /> : null}
          </>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('jbrowseLink', {
        header: 'JBrowse',
        cell: info => <StyledLink href={info.getValue()}>JBrowse</StyledLink>,
        enableSorting: false,
      }),

      columnHelper.accessor('assemblyStatus', {
        header: 'Assembly status',
        enableSorting: true,
        cell: info => (
          <div className={styles.whitespaceNowrap}>{info.getValue()}</div>
        ),
        sortingFn: (
          rowA,
          rowB,
        ) => {
          const a =
            statusOrder[
              rowA.original.assemblyStatus
            ] || 999
          const b =
            statusOrder[
              rowB.original.assemblyStatus
            ] || 999
          return a - b
        },
      }),

      columnHelper.accessor('seqReleaseDate', {
        header: 'Release date',
        cell: info => info.getValue().replace('00:00', ''),
        enableSorting: true,
      }),
      columnHelper.accessor('scientificName', {
        header: 'Scientific name',
        cell: info => highlightText(info.getValue() || '', searchQuery),
        enableSorting: true,
      }),
      columnHelper.accessor('ncbiAssemblyName', {
        header: 'NCBI assembly name',
        cell: info => highlightText(info.getValue() || '', searchQuery),
        enableSorting: true,
      }),
      columnHelper.accessor('accession', {
        header: 'Accession',
        enableSorting: true,
      }),
      columnHelper.accessor('taxonId', {
        header: 'Taxonomy ID',
        cell: info => (
          <a
            href={`https://www.ncbi.nlm.nih.gov/Taxonomy/Browser/wwwtax.cgi?mode=Info&id=${info.getValue()}&lvl=3&p=nuccore&lin=f&keep=1&srchmode=1&unlock`}
          >
            {info.getValue()}
          </a>
        ),
        enableSorting: true,
        meta: { extra: true },
      }),
      columnHelper.accessor('submitterOrg', {
        header: 'Submitter',
        enableSorting: false,
        meta: { extra: true },
      }),
    ],
    [columnHelper, searchQuery],
  )

  return { columns }
}
