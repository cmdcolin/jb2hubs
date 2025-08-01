import { hubCategories } from 'hubtools'

import { StyledLink } from './ui/Link.tsx'

export default function GenArkMainTable() {
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
          .filter(f => f.tag === 'main')
          .map(elt => (
            <tr key={elt.id}>
              <td>
                <StyledLink href={`/hubs/${elt.id}`}>{elt.id}</StyledLink>
              </td>
              <td>{elt.description}</td>
            </tr>
          ))}
      </tbody>
    </table>
  )
}
