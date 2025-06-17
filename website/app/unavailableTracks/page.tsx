import path from 'path'
import fs from 'fs'
import Link from 'next/link'

export default function Page() {
  const data = fs.readFileSync(
    path.join(process.cwd(), 'blockedFiles.txt'),
    'utf8',
  )
  return (
    <div>
      <h3>Blocked files</h3>
      <div>
        This is a list of files that are available at UCSC, but which we were
        not able to ping. See{' '}
        <Link href="https://genome.ucsc.edu/license/">
          https://genome.ucsc.edu/license/
        </Link>{' '}
        for more info not able to ping. These generally have re-sharing
        restrictions and are (currently) unavailable in JBrowse{' '}
      </div>
      <ul>
        {data
          .split('\n')
          .map(f => f.trim())
          .filter(f => !!f)
          .map(r => (
            <li key={r}>{r}</li>
          ))}
      </ul>
    </div>
  )
}
