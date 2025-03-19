import Link from 'next/link'
import './components/table.css'

export default function Home() {
  return (
    <div>
      <h1>JBrowse 2 browsers for UCSC GenArk hubs</h1>

      <p>
        This is a clone of the{' '}
        <a href="https://hgdownload.soe.ucsc.edu/hubs/">UCSC GenArk portal</a>{' '}
        with added JBrowse configs
      </p>
      <table>
        <thead>
          <tr>
            <th>hub&nbsp;gateway</th>
            <th>description</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <Link href="/hubs/primates">primates</Link>
            </td>
            <td>NCBI primate genomes (221 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/mammals">mammals</Link>
            </td>
            <td>NCBI mammal genomes (658 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/birds">birds</Link>
            </td>
            <td>NCBI bird genomes (424 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/fish">fishes</Link>
            </td>
            <td>NCBI fish genomes (453 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/vertebrate">vertebrate</Link>
            </td>
            <td>NCBI other vertebrate genomes (302 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/invertebrate">invertebrate</Link>
            </td>
            <td>NCBI invertebrate genomes (1151 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/fungi">fungi</Link>
            </td>
            <td>NCBI fungi genomes (920 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/plants">plants</Link>
            </td>
            <td>NCBI plant genomes (310 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/viral">viral</Link>
            </td>
            <td>NCBI virus genomes (291 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/bacteria">bacteria</Link>
            </td>
            <td>NCBI bacteria genomes (113 assemblies)</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
