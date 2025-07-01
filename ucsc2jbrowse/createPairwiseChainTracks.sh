#!/bin/bash
set -e
set -o pipefail

ASSEMBLY=$1
OUTDIR=$2

if [ -z "$ASSEMBLY" ]; then
  echo "Usage: $0 <assembly> [outdir]"
  exit 1
fi

if [ -z "$OUTDIR" ]; then
  OUTDIR="$HOME/ucscResults"
fi

CHAINS_DIR="chains"
PIFS_DIR="pifs"
CONFIG_DIR=$OUTDIR/$ASSEMBLY

mkdir -p "$CHAINS_DIR" "$PIFS_DIR" "$CONFIG_DIR/vs"

# Fetches the top-level directory listing and extracts subdirectory names
# starting with "vs"
wget -O - https://hgdownload.soe.ucsc.edu/goldenPath/$ASSEMBLY/ | grep -o 'href="vs[^"]*' | sed 's/href="//' | while read line; do
  # For each subdirectory, fetches its listing, finds the *.all.chain.gz file,
  # and downloads it
  wget -O - https://hgdownload.soe.ucsc.edu/goldenPath/$ASSEMBLY/$line/ | grep -o 'href="[^"]*\.all\.chain\.gz"' | sed 's/href="//' | while read file; do
    CHAIN_PATH="$CHAINS_DIR/$file"
    if [ ! -f "$CHAIN_PATH" ]; then
      wget -O "$CHAIN_PATH" https://hgdownload.soe.ucsc.edu/goldenPath/$ASSEMBLY/$line/$file
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
    cp "$PIF_PATH" "$CONFIG_DIR/vs/"
    cp "$PIF_PATH.csi" "$CONFIG_DIR/vs/"
  done
done

node src/createChainTracks.ts --assembly $ASSEMBLY --source vs
