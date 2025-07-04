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
    </Container>
  )
}
