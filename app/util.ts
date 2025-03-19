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

      return {
        accession: accession || '',
        assembly: assembly || '',
        scientificName: scientificName || '',
        commonName: commonName || '',
        taxonId: taxonId || '',
        genArkClade: genArkClade || '',
        jbrowseLink: `https://jbrowse.org/code/jb2/main/?config=/hubs/genark/${base}/${b1}/${b2}/${b3}/${accession}/hub.txt`,
      }
    })
}
