import path from 'path'

import { Metadata } from 'next'

import styles from './page.module.css'
import { getAccessionById, getAllAccessions } from '../../../lib/api.ts'
import Container from '../../components/Container.tsx'
import { StyledLink } from '../../components/ui/Link.tsx'
import { LI, UL } from '../../components/ui/List.tsx'
import { H1, H2 } from '../../components/ui/Typography.tsx'
import { tryAndReadJSON } from '../../components/util.ts'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const ret = getAccessionById(id)
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
  const ret = getAccessionById(id)
  if (!ret) {
    throw new Error('accession not found')
  }

  const { accession, scientificName } = ret
  const [basePrefix, restOfAccession] = accession.split('_')
  const [part1, part2, part3] = restOfAccession!.match(/.{1,3}/g)!
  const hubBasePath = `hubs/${basePrefix}/${part1}/${part2}/${part3}/${accession}`

  const { imageUrl, pageUrl } = await tryAndReadJSON<any>(
    path.join(process.cwd(), hubBasePath, 'image.json'),
  )
  return (
    <Container>
      <div className={styles.relative}>
        <H1>{scientificName}</H1>
        <div>
          <b>Accession:</b> {ret.accession}
        </div>
        <div>
          <b>Assembly name:</b> {ret.ncbiAssemblyName}
        </div>
        <div>
          <b>Common name:</b> {ret.commonName}
        </div>

        {imageUrl ? (
          <div className={styles.imageContainer}>
            <figure className={styles.figure}>
              <img src={imageUrl} className={styles.image} />
              <figcaption>
                {pageUrl ? (
                  <StyledLink href={pageUrl}>(source)</StyledLink>
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
            <StyledLink href={ret.jbrowseLink}>JBrowse</StyledLink>
          </LI>
          <LI>
            <StyledLink href={ret.igvBrowserLink}>IGV.js</StyledLink>
          </LI>
          <LI>
            <StyledLink href={ret.ncbiBrowserLink}>
              NCBI browser (GDV)
            </StyledLink>
          </LI>
          <LI>
            <StyledLink href={ret.ucscBrowserLink}>UCSC browser</StyledLink>
          </LI>
        </UL>
      </div>
      <div>
        <H2>Portals/data downloads</H2>
        <UL>
          <LI>
            <StyledLink href={ret.ucscDataLink}>UCSC data folder</StyledLink>
          </LI>
          <LI>
            <StyledLink href={ret.ncbiLink}>NCBI assembly page</StyledLink>
          </LI>
          <LI>
            <StyledLink
              href={`https://www.ncbi.nlm.nih.gov/datasets/taxonomy/${ret.taxonId}/`}
            >
              NCBI taxonomy page
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

export function generateStaticParams() {
  const ids = getAllAccessions()
  return ids.map(post => ({
    id: post.id,
  }))
}
