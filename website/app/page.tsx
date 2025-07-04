import Link2 from 'next/link'

import Container from './components/Container.tsx'
import GenArkMainTable from './components/GenArkMainTable.tsx'
import list from './ucsc/list.json'

import './components/table.css'

export default function Home() {
  const s = new Set(['hg38', 'hg19', 'hs1', 'mm39', 'mm10'])
  return (
    <Container>
      <h1>JBrowse 2 hubs</h1>
      <p>
        This page has a variety of data resources focused on data import from
        UCSC for creating JBrowse 2 genome browsers. For information, see the{' '}
        <Link2 href="/about">about</Link2> page.
      </p>
      <div>
        <h2>Main UCSC browsers</h2>
        <p>Short list:</p>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Scientific name</th>
              <th>Organism</th>
              <th>Description</th>
              <th>JBrowse</th>
              <th>UCSC</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(list.ucscGenomes)
              .filter(([key]) => s.has(key))
              .map(([key, val]) => {
                return (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{val.scientificName}</td>
                    <td>{val.organism}</td>
                    <td>{val.description}</td>
                    <td>
                      <Link2
                        href={`https://jbrowse.org/code/jb2/main/?config=/ucsc/${key}/config.json`}
                      >
                        JBrowse
                      </Link2>
                    </td>
                    <td>
                      <Link2
                        href={`https://genome.ucsc.edu/cgi-bin/hgTracks?db=${key}`}
                      >
                        UCSC
                      </Link2>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        <p>
          <ul>
            <li>
              <Link2 href="/ucsc">Click here</Link2> for a more complete listing
            </li>
            <li>
              <Link2 href="https://jbrowse.org/code/jb2/frozen_tracks4/?config=/ucsc/all.json">
                Click here
              </Link2>{' '}
              for single JBrowse 2 instance containing ALL the species. This is
              the instance you should use if you want to browse synteny datasets
              that compare different species
            </li>
          </ul>
          Note that some tracks/files are not available, see{' '}
          <Link2 href="/unavailableTracks">unavailable tracks</Link2>{' '}
        </p>
      </div>

      <div>
        <h2>GenArk browsers</h2>
        <div>
          We have created JBrowse portals for all the UCSC GenArk browsers,
          which are trackhubs generated from NCBI assemblies. Please see{' '}
          <Link2 href="/genark">GenArk</Link2>
        </div>
        <GenArkMainTable />
      </div>

      <div>
        <h2>Citing resources:</h2>
        <p>
          To reference this resource, please cite:{' '}
          <i>
            JBrowse 2: a modular genome browser with views of synteny and
            structural variation. Genome Biology (2023).
            <Link2 href="https://doi.org/10.1186/s13059-023-02914-z">
              https://doi.org/10.1186/s13059-023-02914-z
            </Link2>
          </i>
        </p>
        <p>
          To reference UCSC GenArk resources in publications, please cite:{' '}
          <i>
            GenArk: towards a million UCSC genome browsers. Genome Biology
            (2023).{' '}
            <Link2 href="https://doi.org/10.1186/s13059-023-03057-x">
              https://doi.org/10.1186/s13059-023-03057-x
            </Link2>
          </i>
        </p>
        <p>
          To reference other UCSC resources and tools, please see this page
          <Link2 href="https://genome.ucsc.edu/cite.html">
            https://genome.ucsc.edu/cite.html
          </Link2>
        </p>
        <p>
          To reference the data for species of the main UCSC genome browse,
          please see this page:
          <Link2 href="https://genome.ucsc.edu/cite.html">
            https://genome.ucsc.edu/goldenPath/credits.html
          </Link2>
        </p>
        <p>
          And lastly, a big thank you to UCSC for their work and their open
          licensing of datasources. See https://genome.ucsc.edu/license/ for
          more info.
        </p>
      </div>
      <div className="mt-20">
        Feel free to contact or report issues to{' '}
        <Link2 href="https://github.com/cmdcolin/jb2hubs/">Github</Link2>
      </div>
    </Container>
  )
}
