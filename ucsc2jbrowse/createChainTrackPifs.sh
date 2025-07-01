#!/bin/bash
#
# createChainTrackPifs.sh
#
# Downloads chain files and converts them to PIF (Pairwise Indexed PAF) format.
# This script can handle two different sources for chain files: 'liftOver' and 'pairwise'.
#
# Usage: ./createChainTrackPifs.sh <source> <assembly> [outdir]
#   source:   'liftOver' or 'pairwise'. This determines the URL and directory structure.
#   assembly: The assembly name (e.g., hg38).
#   outdir:   The root output directory for all assemblies. Defaults to ~/ucscResults.
#

set -euo pipefail

# --- Functions ---

# Prints usage information and exits.
usage() {
  echo "Usage: $0 <source> <assembly> [outdir]"
  echo "  source:   'liftOver' or 'pairwise'"
  echo "  assembly: The assembly name (e.g., hg38)"
  echo "  outdir:   Root output directory. Defaults to ~/ucscResults"
  exit 1
}

# Downloads a file if it doesn't already exist.
# $1: URL
# $2: Output path
download_file() {
  local url="$1"
  local output_path="$2"
  if [ ! -f "$output_path" ]; then
    echo "Downloading $url..."
    # Use a temporary file to ensure atomic downloads
    wget -q -O "$output_path.tmp" "$url" && mv "$output_path.tmp" "$output_path"
  fi
}

# Converts a chain file to a PIF file.
# $1: Path to the chain file (.chain.gz)
# $2: Path to the output PIF file (.pif.gz)
create_pif() {
  local chain_path="$1"
  local pif_path="$2"
  if [ ! -f "$pif_path" ]; then
    echo "Creating PIF file for $(basename "$chain_path")..."
    local paf_path
    paf_path=$(mktemp)
    pigz -dc "$chain_path" | chain2paf --input /dev/stdin >"$paf_path"
    jbrowse make-pif "$paf_path" --csi --out "$pif_path"
    rm "$paf_path"
  fi
}

# --- Main Script ---

# Validate arguments
SOURCE=${1:-}
ASSEMBLY=${2:-}
OUTDIR=${3:-"$HOME/ucscResults"}

if [[ -z "$SOURCE" || -z "$ASSEMBLY" ]]; then
  usage
fi

# Define directories
CHAINS_DIR="chains"
PIFS_DIR="pifs"
CONFIG_DIR="$OUTDIR/$ASSEMBLY"

mkdir -p "$CHAINS_DIR" "$PIFS_DIR"

# --- Logic for different sources ---

case "$SOURCE" in
liftOver)
  LIFTOVER_DIR="$CONFIG_DIR/liftOver"
  mkdir -p "$LIFTOVER_DIR"
  URL="https://hgdownload.soe.ucsc.edu/goldenPath/$ASSEMBLY/liftOver/"

  echo "Processing liftOver chains for $ASSEMBLY..."
  wget -q -O - "$URL" | grep -o 'href="[^"]*"' | sed "s!href=\"\(.*\)\"!$URL\1!" | grep -v md5sum | grep '\.chain\.gz$' | while read -r url; do
    FILENAME=$(basename "$url")
    FILENAME_NO_EXT=$(echo "$FILENAME" | sed 's/\.chain\.gz//')
    CHAIN_PATH="$CHAINS_DIR/$FILENAME"
    PIF_PATH="$PIFS_DIR/$FILENAME_NO_EXT.pif.gz"

    download_file "$url" "$CHAIN_PATH"
    create_pif "$CHAIN_PATH" "$PIF_PATH"

    # Copy PIF files to the assembly's liftOver directory
    cp "$PIF_PATH" "$LIFTOVER_DIR/"
    cp "$PIF_PATH.csi" "$LIFTOVER_DIR/"
  done
  ;;

pairwise)
  PAIRWISE_DIR="$CONFIG_DIR/vs"
  mkdir -p "$PAIRWISE_DIR"
  BASE_URL="https://hgdownload.soe.ucsc.edu/goldenPath/$ASSEMBLY"

  echo "Processing pairwise chains for $ASSEMBLY..."
  # Get 'vs*' subdirectories
  wget -q -O - "$BASE_URL/" | grep -o 'href="vs[^"]/"' | sed 's/href="//' | while read -r subdir; do
    # Get '*.all.chain.gz' files from the subdirectory
    wget -q -O - "$BASE_URL/$subdir/" | grep -o 'href="[^"]*\.all\.chain\.gz"' | sed 's/href="//' | while read -r file; do
      CHAIN_PATH="$CHAINS_DIR/$file"
      FILENAME_NO_EXT=$(echo "$file" | sed 's/\.all\.chain\.gz//')
      PIF_PATH="$PIFS_DIR/$FILENAME_NO_EXT.pif.gz"

      download_file "$BASE_URL/$subdir/$file" "$CHAIN_PATH"
      create_pif "$CHAIN_PATH" "$PIF_PATH"

      # Copy PIF files to the assembly's vs directory
      cp "$PIF_PATH" "$PAIRWISE_DIR/"
      cp "$PIF_PATH.csi" "$PAIRWISE_DIR/"
    done
  done
  ;;

*)
  echo "Error: Invalid source '$SOURCE'. Must be 'liftOver' or 'pairwise'."
  usage
  ;;
esac

echo "Finished processing $SOURCE chains for $ASSEMBLY."
