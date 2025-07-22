import path from 'path'

import { Metadata } from 'next'
import slugify from 'slugify'

import { getAccessionById, getAllAccessions } from '../../../lib/api.ts'
import { StyledLink } from '../../components/ui/Link.tsx'
import { LI, UL } from '../../components/ui/List.tsx'
import { H1, H2, H4 } from '../../components/ui/Typography.tsx'
import { tryAndReadText } from '../../components/util.ts'
import Container from '../../components/Container.tsx'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const ret = await getAccessionById(id)
  if (!ret) {
    throw new Error(`${id} not found`)
  }
  return {
    title: ret.scientificName,
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const ret = await getAccessionById(id)
  if (!ret) {
    throw new Error('accession not found')
  }

  const { scientificName } = ret
  const imgBase = path.join(
    process.cwd(),
    'speciesImages',
    slugify(scientificName),
  )

  const val = await tryAndReadText(imgBase + '.txt')
  const source = await tryAndReadText(imgBase + '_page.txt')
  return (
    <Container>
      <div className="relative">
        <H1>{scientificName}</H1>
        <div>
          <H4>Accession:</H4> {ret.accession}
        </div>
        <div>
          <H4>Assembly name:</H4> {ret.ncbiAssemblyName}
        </div>
        <div>
          <H4>Common name:</H4> {ret.commonName}
        </div>

        {val ? (
          <div className="float-right ml-6 mb-4 max-w-xs">
            <figure className="m-0">
              <img src={val} className="max-w-full" />
              <figcaption>
                {source ? (
                  <StyledLink href={source}>(source)</StyledLink>
                ) : (
                  'no link'
                )}
              </figcaption>
            </figure>
          </div>
        ) : null}
      </div>

      <div>
        <H2>Genome browsers</H2>
        <UL>
          <LI>
            <StyledLink href={ret.jbrowseLink}>JBrowse </StyledLink>
          </LI>
          <LI>
            <StyledLink href={ret.igvBrowserLink}>IGV.js</StyledLink>
          </LI>
          <LI>
            <StyledLink href={ret.ncbiBrowserLink}>NCBI GDV</StyledLink>
          </LI>
          <LI>
            <StyledLink href={ret.ucscBrowserLink}>UCSC</StyledLink>
          </LI>
        </UL>
      </div>
      <div>
        <H2>Portals/data downloads</H2>
        <UL>
          <LI>
            <StyledLink href={ret.ucscDataLink}>UCSC hub folder</StyledLink>
          </LI>
          <LI>
            <StyledLink href={ret.ncbiLink}>NCBI assembly page</StyledLink>
          </LI>
          <LI>
            <StyledLink
              href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${ret.taxonId}/`}
            >
              NCBI datasets taxonomy page
            </StyledLink>
          </LI>
          <LI>
            <StyledLink
              href={`https://www.google.com/search?q=${encodeURIComponent(scientificName)}&sa=X&aep=1&ntc=1&udm=50`}
            >
              Google AI overview
            </StyledLink>
          </LI>
        </UL>
      </div>
    </Container>
  )
}

export async function generateStaticParams() {
  const posts = await getAllAccessions()
  return posts.map(post => ({
    id: post.id,
  }))
}
