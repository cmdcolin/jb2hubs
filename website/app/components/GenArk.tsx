import GenArkMainTable from './GenArkMainTable.tsx'
import GenArkProjectTable from './GenArkProjectTable.tsx'

import './table.css'
import { H3 } from './ui/Typography.tsx'

export default function GenArk() {
  return (
    <div>
      <H3>Species categories: </H3>
      <GenArkMainTable />

      <H3>Project collections</H3>
      <GenArkProjectTable />
    </div>
  )
}
