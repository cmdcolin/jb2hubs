import GenArkMainTable from './GenArkMainTable.tsx'
import GenArkProjectTable from './GenArkProjectTable.tsx'

export default function GenArk() {
  return (
    <div>
      <h3>UCSC GenArk browsers</h3>
      <GenArkMainTable />

      <h3>Projects</h3>
      <p>collections below are subsets of the assemblies above</p>
      <GenArkProjectTable />
    </div>
  )
}
