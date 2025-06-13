#!/bin/bash
mkdir -p gff
cd gff
if [ ! -f hs1.gff.gz.csi ]; then
  datasets download genome accession GCF_009914755.1 --include gff3,seq-report
  unzip ncbi_dataset.zip
  jbrowse sort-gff ncbi_dataset/data/GCF_009914755.1/genomic.gff | bgzip -@8 >hs1.gff.gz
  tabix -C hs1.gff.gz
fi
jbrowse add-track hs1.gff.gz --force --trackId hs1-ncbiRefSeqGff --name "RefSeq All - GFF" --category "NCBI RefSeq" --out ~/ucscResults/hs1/ --load copy --indexFile hs1.gff.gz.csi
jbrowse text-index --force --out ~/ucscResults/hs1 --tracks hs1-ncbiRefSeqGff
cd ..
