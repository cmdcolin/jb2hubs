import Link2 from 'next/link'

import Container from '../components/Container.tsx'

export default function About() {
  return (
    <Container>
      <div>
        <h1>About</h1>
        <p>
          This resource was created by bulk importing UCSC data to create
          annotation-rich JBrowse data resources. We created scripts (
          <Link2 href="https://github.com/cmdcolin/jb2hubs/">GitHub</Link2>) for
          parsing UCSC MySQL database dumps for the main UCSC genome browser
          sets, and for converting hub.txt files to JBrowse config.json files
          for the GenArk configs
        </p>
      </div>
      <div>
        <h2>FAQ</h2>
        <dl>
          <dt className="font-bold">
            Why did you bulk import the UCSC data instead of using UCSC REST
            API?
          </dt>
          <dd>
            Using bulk import gives us more control and allows us to create a
            native JBrowse 2 experience instead of designing an extensive
            compatibility layer. The UCSC REST API is rate limited and also not
            comprehensive for all the types of data we want to access
          </dd>
        </dl>
        <dl>
          <dt className="font-bold">
            Why did you bulk import the UCSC data instead of using track hubs
            (hub.txt) files?
          </dt>
          <dd>
            UCSC does not have hub.txt files for their main browsers, like hg19
            and hg38, so adding a bulk import process was the easiest way to
            make browsers with access to their datasets
          </dd>
        </dl>
      </div>

      <div>
        <h2>Citing resources:</h2>
        <p>
          To reference this resource, please cite:{' '}
          <i>
            JBrowse 2: a modular genome browser with views of synteny and
            structural variation. Genome Biology (2023).
            <Link2 href="https://doi.org/10.1186/s13059-023-02914-z">
              https://doi.org/10.1186/s13059-023-02914-z
            </Link2>
          </i>
        </p>

        <p>
          To reference UCSC GenArk resources in publications, please cite:{' '}
          <i>
            GenArk: towards a million UCSC genome browsers. Genome Biology
            (2023).{' '}
            <Link2 href="https://doi.org/10.1186/s13059-023-03057-x">
              https://doi.org/10.1186/s13059-023-03057-x
            </Link2>
          </i>
        </p>
        <p>
          To reference other UCSC resources and tools, please see this page
          <Link2 href="https://genome.ucsc.edu/cite.html">
            https://genome.ucsc.edu/cite.html
          </Link2>
        </p>
        <p>
          To reference the data for species of the main UCSC genome browse,
          please see this page:
          <Link2 href="https://genome.ucsc.edu/cite.html">
            https://genome.ucsc.edu/goldenPath/credits.html
          </Link2>
        </p>
        <p>
          And lastly, a big thank you to UCSC for their work and their open
          licensing of datasources. See https://genome.ucsc.edu/license/ for
          more info.
        </p>
      </div>
      <div className="mt-20">
        Feel free to contact or report issues to{' '}
        <Link2 href="https://github.com/cmdcolin/jb2hubs/">Github</Link2>
      </div>
    </Container>
  )
}
