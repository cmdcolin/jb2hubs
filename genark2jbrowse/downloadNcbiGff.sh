#!/bin/bash

# Set NODE_OPTIONS to suppress experimental warnings
export NODE_OPTIONS="--no-warnings=ExperimentalWarning"

if [ -t 1 ]; then
  PARALLEL_OPTS="--bar"
else
  PARALLEL_OPTS=""
fi
export PARALLEL_OPTS
# Define function to download a single NCBI GFF file.
download_ncbi_gff() {
  local url="$1"
  local common_name="$2"
  local filename=$(basename "$url")
  if [ ! -f "gff/$filename" ] || [ -n "$REDOWNLOAD" ]; then
    echo "Downloading GFF file for $common_name: $url"
    if [ -n "$REDOWNLOAD" ]; then
      if wget -N -q "$url" -P gff; then
        echo "Successfully downloaded $common_name: $filename"
      else
        echo "Failed to download $common_name: $url" >&2
      fi
    else
      if wget -nc -q "$url" -P gff; then
        echo "Successfully downloaded $common_name: $filename"
      else
        echo "Failed to download $common_name: $url" >&2
      fi
    fi
  fi
}

export -f download_ncbi_gff # Export function for use with GNU Parallel

# Extract NCBI GFF URLs from processed JSON and download them
cat processedHubJson/all.json | jq -r '.[] | select(.ncbiGff | test("GCF_")) | "\(.ncbiGff)\t\(.commonName)"' | parallel -j1 $PARALLEL_OPTS --colsep '\t' download_ncbi_gff
