#!/bin/bash
set -e
set -o pipefail

# Fetches the top-level directory listing and extracts subdirectory names starting with "vs"
wget -q -O - https://hgdownload.soe.ucsc.edu/goldenPath/hg38/ | grep -o 'href="vs[^/"]*' | sed 's/href="//' | while read line; do
  # For each subdirectory, fetches its listing, finds the *.all.chain.gz file, and downloads it
  wget -q -O - https://hgdownload.soe.ucsc.edu/goldenPath/hg38/$line/ | grep -o 'href="[^"]*\.all\.chain\.gz"' | sed 's/href="//' | while read file; do
    echo wget -q https://hgdownload.soe.ucsc.edu/goldenPath/hg38/$line/$file
  done
done
