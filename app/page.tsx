import Link from 'next/link'
import './components/table.css'

const other = {
  BRC: 'BRC (VEuPathDB and more)',
  CCGP: 'California Conservation Genome Project',
  HPRC: 'Human Pangenome Resource Project',
  VGP: 'Vertebrate Genome Project',
  legacy: '',
}
export default function Home() {
  return (
    <div>
      <h1>JBrowse 2 browsers for UCSC GenArk hubs</h1>
      <p>
        This is a clone of the{' '}
        <Link href="https://hgdownload.soe.ucsc.edu/hubs/">
          UCSC GenArk portal
        </Link>{' '}
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
              <Link href="/hubs/primates" target="_blank">
                primates
              </Link>
            </td>
            <td>NCBI primate genomes (221 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/mammals" target="_blank">
                mammals
              </Link>
            </td>
            <td>NCBI mammal genomes (658 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/birds" target="_blank">
                birds
              </Link>
            </td>
            <td>NCBI bird genomes (424 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/fish" target="_blank">
                fishes
              </Link>
            </td>
            <td>NCBI fish genomes (453 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/vertebrate" target="_blank">
                vertebrate
              </Link>
            </td>
            <td>NCBI other vertebrate genomes (302 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/invertebrate" target="_blank">
                invertebrate
              </Link>
            </td>
            <td>NCBI invertebrate genomes (1151 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/fungi" target="_blank">
                fungi
              </Link>
            </td>
            <td>NCBI fungi genomes (920 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/plants" target="_blank">
                plants
              </Link>
            </td>
            <td>NCBI plant genomes (310 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/viral" target="_blank">
                viral
              </Link>
            </td>
            <td>NCBI virus genomes (291 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/bacteria" target="_blank">
                bacteria
              </Link>
            </td>
            <td>NCBI bacteria genomes (113 assemblies)</td>
          </tr>
          <tr>
            <th colSpan={2}>
              collections below are subsets of the assemblies above
            </th>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/VGP" target="_blank">
                VGP
              </Link>
            </td>
            <td>Vertebrate Genomes Project collection (1186 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/CCGP" target="_blank">
                CCGP
              </Link>
            </td>
            <td>
              The California Conservation Genomics Project (126 assemblies)
            </td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/HPRC" target="_blank">
                HPRC
              </Link>
            </td>
            <td>Human Pangenome Reference Consortium (96 assemblies)</td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/BRC" target="_blank">
                BRC
              </Link>
            </td>
            <td>
              BRC Analytics - Bioinformatics Research Center (778 assemblies)
            </td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/globalReference" target="_blank">
                globalReference
              </Link>
            </td>
            <td>
              Global Human Reference genomes, January 2020 (10 assemblies)
            </td>
          </tr>
          <tr>
            <td>
              <Link href="/hubs/legacy" target="_blank">
                legacy
              </Link>
            </td>
            <td>
              NCBI genomes legacy/superseded by newer versions (551 assemblies)
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
