#!/bin/bash
set -e
set -o pipefail

CHAINS_DIR="chains"
PIFS_DIR="pifs"

mkdir -p "$CHAINS_DIR" "$PIFS_DIR"

# Fetches the top-level directory listing and extracts subdirectory names starting with "vs"
wget -O - https://hgdownload.soe.ucsc.edu/goldenPath/hg38/ | grep -o 'href="vs[^/"]*' | sed 's/href="//' | while read line; do
  # For each subdirectory, fetches its listing, finds the *.all.chain.gz file, and downloads it
  wget -O - https://hgdownload.soe.ucsc.edu/goldenPath/hg38/$line/ | grep -o 'href="[^"]*\.all\.chain\.gz"' | sed 's/href="//' | while read file; do
    CHAIN_PATH="$CHAINS_DIR/$file"
    if [ ! -f "$CHAIN_PATH" ]; then
      wget -O "$CHAIN_PATH" https://hgdownload.soe.ucsc.edu/goldenPath/hg38/$line/$file
    fi
    FILENAME2=$(echo "$file" | sed 's/\.all\.chain\.gz//')
    PIF_PATH="$PIFS_DIR/$FILENAME2.pif.gz"
    if [ ! -f "$PIF_PATH" ]; then
      echo "Creating PIF file for $file..."
      PAF_PATH="$(mktemp)"
      pigz -dc "$CHAIN_PATH" | chain2paf --input /dev/stdin >"$PAF_PATH"
      jbrowse make-pif "$PAF_PATH" --csi --out "$PIF_PATH"
      rm "$PAF_PATH"
    fi
  done
done
