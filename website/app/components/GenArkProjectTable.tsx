import { hubCategories } from 'hubtools'
import Link2 from 'next/link'

export default function GenArkProjectTable() {
  return (
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
                <Link2 href={`/hubs/${elt.id}`}>{elt.id}</Link2>
              </td>
              <td>{elt.description}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
