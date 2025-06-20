#!/bin/bash

export NODE_OPTIONS="--no-warnings=ExperimentalWarning"
export PATH=$(pwd):$PATH
mkdir -p ~/ucscResults
curl https://api.genome.ucsc.edu/list/ucscGenomes >~/ucscResults/list.json
curl https://api.genome.ucsc.edu/list/ucscGenomes | jq . >../website/app/ucsc/list.json

: ${OUT:=~/ucsc}
: ${OUT2:=~/ucscAlt}

# non-hub like entries
cat ~/ucscResults/list.json | jq -r '.ucscGenomes | to_entries[] | select(.value.nibPath | (. != null and startswith("hub:") | not)) | .key' | while
  read p
do
  if [ "$p" = "cb1" ]; then
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
