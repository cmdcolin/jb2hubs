import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <h1>Assembly Hub List</h1>

      <p>
        This is a clone of the{' '}
        <a href="https://hgdownload.soe.ucsc.edu/hubs/">UCSC GenArk portal</a>{' '}
        with added JBrowse configs
      </p>
      <thead>
        <tr>
          <th>hub&nbsp;gateway</th>
          <th>description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <Link href="/primates">primates</Link>
          </td>
          <td>NCBI primate genomes (221 assemblies)</td>
        </tr>
        <tr>
          <td>
            <Link href="/mammals">mammals</Link>
          </td>
          <td>NCBI mammal genomes (658 assemblies)</td>
        </tr>
        <tr>
          <td>
            <Link href="/birds">birds</Link>
          </td>
          <td>NCBI bird genomes (424 assemblies)</td>
        </tr>
        <tr>
          <td>
            <Link href="/fish">fishes</Link>
          </td>
          <td>NCBI fish genomes (453 assemblies)</td>
        </tr>
        <tr>
          <td>
            <Link href="/vertebrate">vertebrate</Link>
          </td>
          <td>NCBI other vertebrate genomes (302 assemblies)</td>
        </tr>
        <tr>
          <td>
            <Link href="/invertebrate">invertebrate</Link>
          </td>
          <td>NCBI invertebrate genomes (1151 assemblies)</td>
        </tr>
        <tr>
          <td>
            <Link href="/fungi">fungi</Link>
          </td>
          <td>NCBI fungi genomes (920 assemblies)</td>
        </tr>
        <tr>
          <td>
            <Link href="/plants">plants</Link>
          </td>
          <td>NCBI plant genomes (310 assemblies)</td>
        </tr>
        <tr>
          <td>
            <Link href="/viral">viral</Link>
          </td>
          <td>NCBI virus genomes (291 assemblies)</td>
        </tr>
        <tr>
          <td>
            <Link href="/bacteria">bacteria</Link>
          </td>
          <td>NCBI bacteria genomes (113 assemblies)</td>
        </tr>
      </tbody>
    </div>
  )
}
