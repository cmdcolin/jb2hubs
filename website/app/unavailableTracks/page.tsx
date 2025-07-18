import fs from 'fs'
import path from 'path'

import { dedupe } from 'hubtools'

import Container from '../components/Container.tsx'
import { StyledLink } from '../components/ui/Link.tsx'
import { LI, UL } from '../components/ui/List.tsx'
import { H3, P } from '../components/ui/Typography.tsx'

export default function Page() {
  const data = fs.readFileSync(
    path.join(process.cwd(), 'blockedFiles.txt'),
    'utf8',
  )
  return (
    <Container>
      <H3>Unavailable tracks</H3>
      <P>
        This is a list of files that are available at UCSC, but which we were
        not able to ping. See{' '}
        <StyledLink href="https://genome.ucsc.edu/license/">
          https://genome.ucsc.edu/license/
        </StyledLink>{' '}
        for more info. Most of these fall under this restriction category:
        &quot;Certain genome annotation data, mostly on the human genome and in
        the domain of clinical genetics, have specific restrictions. For some of
        these, we are not allowed to make the data available. Usually the data
        must be obtained from the source database directly in the original
        format or licensed, rather from UCSC. Examples are HGMD, LOVD, OMIM,
        Decipher, Genomenon, Genehancer and COSMIC.&quot; These generally have
        re-sharing restrictions and are (currently) unavailable in JBrowse,
        though we may be able to load them. Please get in touch if you are
        interested in seeing them{' '}
      </P>
      <UL>
        {dedupe(
          data
            .split('\n')
            .map(f => f.trim())
            .filter(f => !!f),
        )
          .sort()
          .map(r => (
            <LI key={r}>{r}</LI>
          ))}
      </UL>
    </Container>
  )
}
