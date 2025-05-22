#!/bin/bash

export NODE_OPTIONS="--no-warnings=ExperimentalWarning"
export PATH=$(pwd):$PATH
mkdir -p ~/ucscResults
curl https://api.genome.ucsc.edu/list/ucscGenomes >~/ucscResults/list.json

: ${OUT:=~/ucsc}
: ${OUT2:=~/ucscAlt}

curl https://api.genome.ucsc.edu/list/ucscGenomes | jq -r '.ucscGenomes | keys[]' | while
  read p
do
  if [ "$p" = "cb1" ] || [ "$p" = "hs1" ]; then
    echo "Skipping $p genome"
    continue
  fi
  echo "rsync $OUT/$p"
  mkdir -p $OUT/$p/$p
  rsync --max-size=2G -qavzP rsync://hgdownload.cse.ucsc.edu/goldenPath/$p/database $OUT/$p/$p/
done

for p in hgFixed; do
  echo "rsync $OUT2/$p"
  mkdir -p $OUT2/$p/$p
  rsync --max-size=2G -azP rsync://hgdownload.cse.ucsc.edu/goldenPath/hgFixed/database $OUT2/$p/$p/
done
