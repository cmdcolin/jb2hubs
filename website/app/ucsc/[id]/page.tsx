import { Metadata } from 'next'

import Container from '../../components/Container.tsx'
import { StyledLink } from '../../components/ui/Link.tsx'
import { LI, UL } from '../../components/ui/List.tsx'
import { H1, H2, H4 } from '../../components/ui/Typography.tsx'
import list from '../list.json'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  return {
    title: id,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const ret = list.ucscGenomes[id as keyof (typeof list)['ucscGenomes']]

  return (
    <Container>
      <div className="relative">
        <H1>{ret.scientificName}</H1>

        <div>
          <H4>Description:</H4> {ret.description}
        </div>
        <div>
          <H4>Assembly name:</H4> {id}
        </div>
        <div>
          <H4>Common name:</H4> {ret.organism}
        </div>
      </div>

      <div>
        <H2>Genome browsers</H2>
        <UL>
          <LI>
            <StyledLink
              href={`https://jbrowse.org/code/jb2/main/?config=https://jbrowse.org/ucsc/${id}/config.json`}
            >
              JBrowse
            </StyledLink>
          </LI>
          <LI>
            <StyledLink
              href={`https://genome.ucsc.edu/cgi-bin/hgTracks?db=${id}`}
            >
              UCSC
            </StyledLink>
          </LI>
        </UL>
      </div>

      <div>
        <H2>Portals/data downloads</H2>
        <UL>
          <LI>
            <StyledLink
              href={`https://genome.ucsc.edu/cgi-bin/hgGateway?db=${id}`}
            >
              UCSC assembly info
            </StyledLink>
          </LI>
        </UL>
      </div>
    </Container>
  )
}

export function generateStaticParams() {
  return Object.keys(list.ucscGenomes).map(id => ({
    id,
  }))
}
