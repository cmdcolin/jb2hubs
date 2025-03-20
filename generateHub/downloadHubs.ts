import fs from 'node:fs'
import { myfetchtext, readJSON } from './util.ts'

const ret = [
  {
    id: 'primates',
    description: 'NCBI primate genomes',
    tag: 'main',
  },
  {
    id: 'mammals',
    description: 'NCBI mammal genomes',
    tag: 'main',
  },
  {
    id: 'birds',
    description: 'NCBI bird genomes',
    tag: 'main',
  },
  {
    id: 'fish',
    description: 'NCBI fish genomes',
    tag: 'main',
  },
  {
    id: 'vertebrate',
    description: 'NCBI vertebrate genomes',
    tag: 'main',
  },
  {
    id: 'invertebrate',
    description: 'NCBI invertebrate genomes',
    tag: 'main',
  },
  {
    id: 'fungi',
    description: 'NCBI fungi genomes',
    tag: 'main',
  },
  {
    id: 'plants',
    description: 'NCBI plant genomes',
    tag: 'main',
  },
  {
    id: 'viral',
    description: 'NCBI viral genomes',
    tag: 'main',
  },
  {
    id: 'bacteria',
    description: 'NCBI bacteria genomes',
    tag: 'main',
  },
  {
    id: 'VGP',
    description: 'Vertebrate Genome Project',
    tag: 'other',
  },
  {
    id: 'CCGP',
    description: 'The California Conservation Genomics Project',
    tag: 'other',
  },
  {
    id: 'HPRC',
    description: 'Human Pangenome Reference Consortium',
    tag: 'other',
  },
  {
    id: 'BRC',
    description:
      'BRC Analytics - Bioinformatics Research Center (VEuPathDB and others)',
    tag: 'other',
  },
  {
    id: 'globalReference',
    description: 'Global Human Reference genomes, January 2020',
    tag: 'other',
  },
  {
    id: 'legacy',
    description: 'NCBI genomes legacy/superseded by newer versions',
    tag: 'other',
  },
]
for (const { id } of ret) {
  fs.writeFileSync(
    `hubJson/${id}.json`,
    await myfetchtext(
      `https://hgdownload.soe.ucsc.edu/hubs/${id}/assemblyList.json`,
    ),
  )
}
