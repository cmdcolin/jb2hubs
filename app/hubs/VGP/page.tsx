import { DataTable } from '@/app/components/DataTable'

async function myjsonfetch(url: string) {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`)
  }
  return res.json()
}
export default async function VGP() {
  const data = await myjsonfetch(
    'https://hgdownload.soe.ucsc.edu/hubs/VGP/assemblyList.json',
  )

  return (
    <DataTable
      rows={data.data.map(
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
          return {
            accession: accession || '',
            assembly: asmId || '',
            scientificName: sciName || '',
            commonName: comName || '',
            taxonId: taxId || '',
            jbrowseLink: `http://jbrowse.org/code/jb2/main/?config=https://jbrowse.org/hubs/genark/${base}/${b1}/${b2}/${b3}/${accession}/config.json`,
            ncbiLink: `https://www.ncbi.nlm.nih.gov/assembly/${accession}`,
            ucscDataLink: `https://hgdownload.soe.ucsc.edu/hubs/${base}/${b1}/${b2}/${b3}/${accession}/`,
            ucscBrowserLink: `https://genome.ucsc.edu/h/${accession}`,
            ncbiName: `${accession}_${asmId}`,
          }
        },
      )}
    />
  )
}
