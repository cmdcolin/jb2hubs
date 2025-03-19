export function getLines(data: string) {
  return data
    .split('\n')
    .map(l => l.trim())
    .filter(line => !!line)
    .filter(line => !line.startsWith('#'))
    .map(line => {
      const [
        accession,
        assembly,
        scientificName,
        commonName,
        taxonId,
        genArkClade,
      ] = line.split('\t')

      const [base, rest] = accession.split('_')
      const [b1, b2, b3] = rest.match(/.{1,3}/g)!
      const ucscBase = `https://hgdownload.soe.ucsc.edu/hubs/${base}/${b1}/${b2}/${b3}/${accession}`

      return {
        accession: accession || '',
        assembly: assembly || '',
        scientificName: scientificName || '',
        commonName: commonName || '',
        taxonId: taxonId || '',
        genArkClade: genArkClade || '',
        jbrowseLink: `http://jbrowse.org/code/jb2/refnamealias_header_name/?config=https://jbrowse.org/hubs/genark/${base}/${b1}/${b2}/${b3}/${accession}/config.json`,
        ncbiLink: `https://www.ncbi.nlm.nih.gov/assembly/${accession}`,
        ucscDataLink: ucscBase,
        ucscBrowserLink: `https://genome.ucsc.edu/h/${accession}`,
        igvBrowserLink: `https://igv.org/app/?hubURL=${ucscBase}/hub.txt`,
        ncbiName: `${accession}_${assembly}`,
      }
    })
}

export function parseAssembliesListJson(data: { data: any }) {
  return data.data.map(
    ({
      taxId,
      asmId,
      genBank,
      refSeq,
      identical,
      sciName,
      comName,
      ucscBrowser,
    }: any) => {
      const accession = genBank || refSeq
      const [base, rest] = accession.split('_')
      const [b1, b2, b3] = rest.match(/.{1,3}/g)!
      const ucscBase = `https://hgdownload.soe.ucsc.edu/hubs/${base}/${b1}/${b2}/${b3}/${accession}`
      return {
        accession: accession || '',
        assembly: asmId || '',
        scientificName: sciName || '',
        commonName: comName || '',
        taxonId: taxId || '',
        jbrowseLink: `http://jbrowse.org/code/jb2/refnamealias_header_name/?config=https://jbrowse.org/hubs/genark/${base}/${b1}/${b2}/${b3}/${accession}/config.json`,
        ncbiLink: `https://www.ncbi.nlm.nih.gov/assembly/${accession}`,
        ucscDataLink: ucscBase,
        ucscBrowserLink: `https://genome.ucsc.edu/h/${accession}`,
        igvBrowserLink: `https://igv.org/app/?hubURL=${ucscBase}/hub.txt`,
        ncbiName: `${accession}_${asmId}`,
      }
    },
  )
}

export async function myjsonfetch(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`)
  }
  return res.json()
}
