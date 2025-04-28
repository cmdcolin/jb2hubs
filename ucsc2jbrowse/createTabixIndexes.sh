#!/bin/bash
# Index all bed.gz files
echo "Indexing BED tabix files"
fd ".bed.gz$" $1 | parallel --bar tabix -C -f {}
echo "Indexing GFF tabix files"
fd ".gff.gz$" $1 | parallel --bar tabix -C -f {}
