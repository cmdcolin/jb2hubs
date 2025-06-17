import path from 'path'
import fs from 'fs'
import Link from 'next/link'
import { dedupe } from 'hubtools'
import Container from '../components/Container'

export default function Page() {
  const data = fs.readFileSync(
    path.join(process.cwd(), 'blockedFiles.txt'),
    'utf8',
  )
  return (
    <Container>
      <h3>Unavailable tracks</h3>
      <div>
        This is a list of files that are available at UCSC, but which we were
        not able to ping. See{' '}
        <Link href="https://genome.ucsc.edu/license/">
          https://genome.ucsc.edu/license/
        </Link>{' '}
        for more info. Most of these fall under this restriction category:
        "Certain genome annotation data, mostly on the human genome and in the
        domain of clinical genetics, have specific restrictions. For some of
        these, we are not allowed to make the data available. Usually the data
        must be obtained from the source database directly in the original
        format or licensed, rather from UCSC. Examples are HGMD, LOVD, OMIM,
        Decipher, Genomenon, Genehancer and COSMIC." These generally have
        re-sharing restrictions and are (currently) unavailable in JBrowse,
        though we may be able to load them. Please get in touch if you are
        interested in seeing them{' '}
      </div>
      <ul>
        {dedupe(
          data
            .split('\n')
            .map(f => f.trim())
            .filter(f => !!f),
        )
          .sort()
          .map(r => (
            <li key={r}>{r}</li>
          ))}
      </ul>
    </Container>
  )
}
