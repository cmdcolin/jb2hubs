import Container from './components/Container.tsx'
import GenArk from './components/GenArk.tsx'
import { StyledLink } from './components/ui/Link.tsx'
import { LI, UL } from './components/ui/List.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableRow,
} from './components/ui/Table.tsx'
import { H1, H2, P } from './components/ui/Typography.tsx'
import list from './ucsc/list.json'

import './components/table.css'

export default function Home() {
  const s = new Set(['hg38', 'hg19', 'hs1', 'mm39', 'mm10'])
  return (
    <Container>
      <H1>JBrowse 2 hubs</H1>
      <P>
        This page has a variety of data resources focused on data import from
        UCSC for creating JBrowse 2 genome browsers. For information, see the{' '}
        <StyledLink href="/about">about</StyledLink> page.
      </P>
      <div>
        <H2>Main genome browsers</H2>
        <P>
          We bulk-loaded as much data as possible from the UCSC Genome Browser
          into JBrowse 2 instances to create a native JBrowse 2 experience with
          rich genome annotations
        </P>
        <P>
          Here is a short list of human and mouse genomes, for more species
          <StyledLink href="/ucsc">click here</StyledLink>
        </P>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Scientific name</TableHeaderCell>
              <TableHeaderCell>Organism</TableHeaderCell>
              <TableHeaderCell>Description</TableHeaderCell>
              <TableHeaderCell>JBrowse</TableHeaderCell>
              <TableHeaderCell>UCSC</TableHeaderCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(list.ucscGenomes)
              .filter(([key]) => s.has(key))
              .map(([key, val]) => {
                return (
                  <TableRow key={key}>
                    <TableCell>{key}</TableCell>
                    <TableCell>{val.scientificName}</TableCell>
                    <TableCell>{val.organism}</TableCell>
                    <TableCell>{val.description}</TableCell>
                    <TableCell>
                      <StyledLink
                        href={`https://jbrowse.org/code/jb2/main/?config=/ucsc/${key}/config.json`}
                        external
                      >
                        JBrowse
                      </StyledLink>
                    </TableCell>
                    <TableCell>
                      <StyledLink
                        href={`https://genome.ucsc.edu/cgi-bin/hgTracks?db=${key}`}
                        external
                      >
                        UCSC
                      </StyledLink>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
        <P>
          <UL>
            <LI>
              <StyledLink href="/ucsc">Click here</StyledLink> for a more
              complete listing
            </LI>
            <LI>
              <StyledLink href="https://jbrowse.org/code/jb2/frozen_tracks4/?config=/ucsc/all.json">
                Click here
              </StyledLink>{' '}
              for single JBrowse 2 instance containing ALL the species
            </LI>
          </UL>
          <P>
            Note that some tracks that are available at UCSC are not yet
            available here, see{' '}
            <StyledLink href="/unavailableTracks">
              unavailable tracks
            </StyledLink>
            .
          </P>
        </P>
      </div>

      <div>
        <H2>GenArk browsers</H2>
        <P>
          We also created JBrowse 2 instances based on the UCSC GenArk browser
          resources, which is an effort to create genome browsers for numerous
          plant, animal, and microbial species. See more below
        </P>
        <GenArk />
      </div>
    </Container>
  )
}
