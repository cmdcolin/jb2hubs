import Container from '../components/Container.tsx'
import { H1, H2, P, DL, DT, DD, Italic } from '../components/ui/Typography'
import { StyledLink } from '../components/ui/Link'

export default function About() {
  return (
    <Container>
      <div>
        <H1>About</H1>
        <P>
          This resource was created by bulk importing UCSC data to create
          annotation-rich JBrowse data resources. We created scripts (
          <StyledLink href="https://github.com/cmdcolin/jb2hubs/" external>GitHub</StyledLink>) for
          parsing UCSC MySQL database dumps for the main UCSC genome browser
          sets, and for converting hub.txt files to JBrowse config.json files
          for the GenArk configs
        </P>
      </div>
      <div>
        <H2>FAQ</H2>
        <DL>
          <DT>
            Why did you bulk import the UCSC data instead of using UCSC REST
            API?
          </DT>
          <DD>
            Using bulk import gives us more control and allows us to create a
            native JBrowse 2 experience instead of designing an extensive
            compatibility layer. The UCSC REST API is rate limited and also not
            comprehensive for all the types of data we want to access
          </DD>
        </DL>
        <DL>
          <DT>
            Why did you bulk import the UCSC data instead of using track hubs
            (hub.txt) files?
          </DT>
          <DD>
            UCSC does not have hub.txt files for their main browsers, like hg19
            and hg38, so adding a bulk import process was the easiest way to
            make browsers with access to their datasets
          </DD>
        </DL>
      </div>

      <div>
        <H2>Citing resources:</H2>
        <P>
          To reference this resource, please cite:{' '}
          <Italic>
            JBrowse 2: a modular genome browser with views of synteny and
            structural variation. Genome Biology (2023).
            <StyledLink href="https://doi.org/10.1186/s13059-023-02914-z" external>
              https://doi.org/10.1186/s13059-023-02914-z
            </StyledLink>
          </Italic>
        </P>

        <P>
          To reference UCSC GenArk resources in publications, please cite:{' '}
          <Italic>
            GenArk: towards a million UCSC genome browsers. Genome Biology
            (2023).{' '}
            <StyledLink href="https://doi.org/10.1186/s13059-023-03057-x" external>
              https://doi.org/10.1186/s13059-023-03057-x
            </StyledLink>
          </Italic>
        </P>
        <P>
          To reference other UCSC resources and tools, please see this page
          <StyledLink href="https://genome.ucsc.edu/cite.html" external>
            https://genome.ucsc.edu/cite.html
          </StyledLink>
        </P>
        <P>
          To reference the data for species of the main UCSC genome browse,
          please see this page:
          <StyledLink href="https://genome.ucsc.edu/goldenPath/credits.html" external>
            https://genome.ucsc.edu/goldenPath/credits.html
          </StyledLink>
        </P>
        <P>
          And lastly, a big thank you to UCSC for their work and their open
          licensing of datasources. See https://genome.ucsc.edu/license/ for
          more info.
        </P>
      </div>
      <div className="mt-20">
        Feel free to contact or report issues to{' '}
        <StyledLink href="https://github.com/cmdcolin/jb2hubs/" external>Github</StyledLink>
      </div>
    </Container>
  )
}
