export default function Home() {
  return (
    <div>
      <h1>Assembly Hub List</h1>

      <p>
        This is a clone of the{' '}
        <a href="https://hgdownload.soe.ucsc.edu/hubs/">UCSC GenArk portal</a>{' '}
        with added JBrowse configs
      </p>
      <thead>
        <tr>
          <th>hub&nbsp;gateway</th>
          <th>description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <a href="primates/" target="_blank">
              primates
            </a>
          </td>
          <td>NCBI primate genomes (221 assemblies)</td>
        </tr>
        <tr>
          <td>
            <a href="mammals/" target="_blank">
              mammals
            </a>
          </td>
          <td>NCBI mammal genomes (658 assemblies)</td>
        </tr>
        <tr>
          <td>
            <a href="birds/" target="_blank">
              birds
            </a>
          </td>
          <td>NCBI bird genomes (424 assemblies)</td>
        </tr>
        <tr>
          <td>
            <a href="fish/" target="_blank">
              fishes
            </a>
          </td>
          <td>NCBI fish genomes (453 assemblies)</td>
        </tr>
        <tr>
          <td>
            <a href="vertebrate/" target="_blank">
              vertebrate
            </a>
          </td>
          <td>NCBI other vertebrate genomes (302 assemblies)</td>
        </tr>
        <tr>
          <td>
            <a href="invertebrate/" target="_blank">
              invertebrate
            </a>
          </td>
          <td>NCBI invertebrate genomes (1151 assemblies)</td>
        </tr>
        <tr>
          <td>
            <a href="fungi/" target="_blank">
              fungi
            </a>
          </td>
          <td>NCBI fungi genomes (920 assemblies)</td>
        </tr>
        <tr>
          <td>
            <a href="plants/" target="_blank">
              plants
            </a>
          </td>
          <td>NCBI plant genomes (310 assemblies)</td>
        </tr>
        <tr>
          <td>
            <a href="viral/" target="_blank">
              viral
            </a>
          </td>
          <td>NCBI virus genomes (291 assemblies)</td>
        </tr>
        <tr>
          <td>
            <a href="bacteria/" target="_blank">
              bacteria
            </a>
          </td>
          <td>NCBI bacteria genomes (113 assemblies)</td>
        </tr>
      </tbody>
    </div>
  )
}
