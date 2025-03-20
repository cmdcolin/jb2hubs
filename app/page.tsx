import Link from 'next/link'
import './components/table.css'
import { readJSON } from '@/generateHub/util'

export default function Home() {
  const r = readJSON('hubCategories.json') as {
    id: string
    tag: string
    description: string
  }[]
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
          {r
            .filter(f => f.tag === 'main')
            .map(elt => (
              <tr>
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
          {r
            .filter(f => f.tag !== 'main')
            .map(elt => (
              <tr>
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
