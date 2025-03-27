import Link from 'next/link'
import './components/table.css'
import { hubCategories } from '@/generateHub/hubCategories'
import { list } from './list'

export default function Home() {
  return (
    <div>
      <h1>JBrowse 2 browsers for UCSC and GenArk hubs</h1>
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
            <th>Name</th>
            <th>JBrowse</th>
            <th>UCSC</th>
          </tr>
        </thead>
        <tbody>
          {list.map(l => {
            return (
              <tr key={l}>
                <td>{l}</td>
                <td>
                  <Link
                    href={`https://jbrowse.org/code/jb2/main/?config=/ucsc/${l}/config.json`}
                  >
                    JBrowse
                  </Link>
                </td>
                <td>
                  <Link
                    href={`https://genome.ucsc.edu/cgi-bin/hgTracks?db=${l}`}
                  >
                    UCSC
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
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
      <div className="mt-20">
        Feel free to contact or report issues to{' '}
        <Link href="https://github.com/cmdcolin/jb2hubs/">Github</Link>
      </div>
    </div>
  )
}
