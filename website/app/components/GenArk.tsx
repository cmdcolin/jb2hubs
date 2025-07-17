import GenArkMainTable from './GenArkMainTable.tsx'
import GenArkProjectTable from './GenArkProjectTable.tsx'
import { H3 } from './ui/Typography.tsx'

import './table.css'

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
