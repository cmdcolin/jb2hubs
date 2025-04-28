import Link from 'next/link'

import list from './list.json'

import '../components/table.css'

export default function UCSC() {
  return (
    <div>
      <Link href="/">Home</Link>
      <h1>Main UCSC browsers</h1>
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
    </div>
  )
}
