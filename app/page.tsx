import Link from 'next/link'

import './components/table.css'
import { list } from './ucsc/list'

import { hubCategories } from '@/generateHub/hubCategories'

export default function Home() {
  return (
    <div>
      <h1>JBrowse 2 browsers for UCSC and GenArk hubs</h1>
      <p>
        This page has JBrowse genome browsers for both main UCSC genomes and the{' '}
        <Link href="https://hgdownload.soe.ucsc.edu/hubs/">
          UCSC GenArk hubs
        </Link>{' '}
      </p>
      <div>
        <h3>Main UCSC browsers</h3>
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
              .sort((a, b) => a[1].orderKey - b[1].orderKey)
              .slice(0, 10)
              .map(([key, val]) => {
                return (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{val.scientificName}</td>
                    <td>{val.organism}</td>
                    <td>{val.description}</td>
                    <td>
                      <Link
                        href={`https://jbrowse.org/code/jb2/main/?config=/ucsc/${key}/config.json`}
                      >
                        JBrowse
                      </Link>
                    </td>
                    <td>
                      <Link
                        href={`https://genome.ucsc.edu/cgi-bin/hgTracks?db=${key}`}
                      >
                        UCSC
                      </Link>
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
        <p>
          <Link href="/ucsc">
            Click here for full list of main UCSC genome browsers
          </Link>
        </p>
      </div>

      <div>
        <h3>UCSC GenArk browsers</h3>
        <table>
          <thead>
            <tr>
              <th>hub&nbsp;gateway</th>
              <th>description</th>
            </tr>
          </thead>
          <tbody>
            {hubCategories
              .filter(f => f.tag === 'main')
              .map(elt => (
                <tr key={elt.id}>
                  <td>
                    <Link href={`/hubs/${elt.id}`} target="_blank">
                      {elt.id}
                    </Link>
                  </td>
                  <td>{elt.description}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <h3>Projects</h3>
        <p>collections below are subsets of the assemblies above</p>
        <table>
          <thead>
            <tr>
              <th>hub&nbsp;gateway</th>
              <th>description</th>
            </tr>
          </thead>
          <tbody>
            {hubCategories
              .filter(f => f.tag !== 'main')
              .map(elt => (
                <tr key={elt.id}>
                  <td>
                    <Link href={`/hubs/${elt.id}`} target="_blank">
                      {elt.id}
                    </Link>
                  </td>
                  <td>{elt.description}</td>
                </tr>
              ))}
          </tbody>
        </table>

        <p>To reference these resources in publications, please credit:</p>
        <p>
          Clawson, H., Lee, B.T., Raney, B.J. et al. GenArk: towards a million
          UCSC genome browsers. Genome Biol 24, 217 (2023).
          https://doi.org/10.1186/s13059-023-03057-x
        </p>
      </div>
      <div className="mt-20">
        Feel free to contact or report issues to{' '}
        <Link href="https://github.com/cmdcolin/jb2hubs/">Github</Link>
      </div>
    </div>
  )
}
