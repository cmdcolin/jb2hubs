import Link from 'next/link'

import Container from '../components/Container.tsx'

export default function About() {
  return (
    <Container>
      <div>
        <h1>About</h1>
        <p>
          This resource was created by bulk importing UCSC data, in the interest
          of enhancing JBrowse data resources. We created scripts (
          <Link href="https://github.com/cmdcolin/jb2hubs/">GitHub</Link>) for
          parsing UCSC MySQL database dumps for the main UCSC genome browser
          sets, and for converting hub.txt files to JBrowse config.json files
          for the GenArk configs
        </p>
      </div>
      <div>
        <h2>FAQ</h2>
        <div>
          <div>Why not just ingest the hub.txt file client side?</div>
          <p>
            This was always an option but adding an extra level of data parsing
            and ingestion gives us more control, the opportunity to add
            accessory resources, and create a meta-resource database like the
            pages you are looking at here!
          </p>
        </div>
      </div>
    </Container>
  )
}
