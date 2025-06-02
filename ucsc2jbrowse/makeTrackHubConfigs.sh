#!/bin/bash

export NODE_OPTIONS="--no-warnings=ExperimentalWarning"
export PATH=$(pwd):$PATH
mkdir -p ~/ucscResults
curl https://api.genome.ucsc.edu/list/ucscGenomes >~/ucscResults/list.json

: ${OUT:=~/ucsc}
: ${OUT2:=~/ucscAlt}

## hub-like entries
cat ~/ucscResults/list.json | jq -r '.ucscGenomes | to_entries[] | select(.value.nibPath | (. != null and startswith("hub:"))) | .key' | while
  read p
do
  OUTDIR=~/ucscResults/$p
  mkdir -p $OUTDIR
  node src/parseTrackHub.ts "https://hgdownload.soe.ucsc.edu/gbdb/$p/hubs/public/hub.txt" $OUTDIR/config.json
done
