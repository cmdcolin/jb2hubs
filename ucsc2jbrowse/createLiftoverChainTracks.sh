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

CONFIG_DIR="$OUTDIR/$ASSEMBLY"
CHAINS_DIR="chains"
PIFS_DIR="pifs"
LIFTOVER_DIR="$CONFIG_DIR/liftOver"

mkdir -p "$CONFIG_DIR" "$CHAINS_DIR" "$PIFS_DIR" "$LIFTOVER_DIR"

URL="https://hgdownload.soe.ucsc.edu/goldenPath/$ASSEMBLY/liftOver/"

wget -q -O - "$URL" | grep -o 'href="[^"]*"' | sed "s!href=\"\(.*\)\"!$URL\1!" | grep -v md5sum | grep .chain.gz | while read url; do
  FILENAME=$(basename "$url")
  FILENAME2=$(echo "$FILENAME" | sed 's/\.chain\.gz//')
  CHAIN_PATH="$CHAINS_DIR/$FILENAME"
  PIF_PATH="$PIFS_DIR/$FILENAME2.pif.gz"

  if [ ! -f "$CHAIN_PATH" ]; then
    echo "Downloading $url..."
    wget -q -O "$CHAIN_PATH.tmp" "$url" && mv "$CHAIN_PATH.tmp" "$CHAIN_PATH"
  fi

  if [ ! -f "$PIF_PATH" ]; then
    echo "Creating PIF file for $FILENAME..."
    PAF_PATH="$(mktemp)"
    pigz -dc "$CHAIN_PATH" | chain2paf --input /dev/stdin >"$PAF_PATH"
    jbrowse make-pif "$PAF_PATH" --csi --out "$PIF_PATH"
    rm "$PAF_PATH"
  fi

  cp "$PIF_PATH" "$LIFTOVER_DIR/"
  cp "$PIF_PATH.csi" "$LIFTOVER_DIR/"
done

node src/createChainTracks.ts --assembly $ASSEMBLY --source liftOver
