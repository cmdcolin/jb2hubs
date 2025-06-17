import { hubCategories } from 'hubtools'
import Link from 'next/link'

export default function GenArk() {
  return (
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
                  <Link href={`/hubs/${elt.id}`}>{elt.id}</Link>
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
                  <Link href={`/hubs/${elt.id}`}>{elt.id}</Link>
                </td>
                <td>{elt.description}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}
