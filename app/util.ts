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
        jbrowseLink: `http://jbrowse.org/code/jb2/main/?config=https://jbrowse.org/hubs/genark/${base}/${b1}/${b2}/${b3}/${accession}/config.json`,
        ncbiLink: `https://www.ncbi.nlm.nih.gov/assembly/${accession}`,
        ucscDataLink: ucscBase,
        ucscBrowserLink: ucscBrowser,
        igvBrowserLink: `https://igv.org/app/?hubURL=${ucscBase}/hub.txt`,
        ncbiName: `${accession}_${asmId}`,
        ncbiBrowserLink: `https://www.ncbi.nlm.nih.gov/gdv/browser/genome/?id=${accession}`,
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
