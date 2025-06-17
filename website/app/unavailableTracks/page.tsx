import fs from 'fs'
export default function Page() {
  const data = fs.readFileSync('../blockedFiles.txt', 'utf8')
  return (
    <div>
      <h3>Blocked files</h3>
      <div>
        This is a list of files that are available at UCSC, but which have
        re-sharing restrictions and are (currently) unavailable in JBrowse{' '}
      </div>
      <ul>
        {data.split('\n').map(r => (
          <li key={r}>{r}</li>
        ))}
      </ul>
    </div>
  )
}
