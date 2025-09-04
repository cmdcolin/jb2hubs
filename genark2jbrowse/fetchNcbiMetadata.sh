#!/bin/bash

# Set NODE_OPTIONS to suppress experimental warnings
export NODE_OPTIONS="--no-warnings=ExperimentalWarning"

if [ -t 1 ]; then
  PARALLEL_OPTS="--bar"
else
  PARALLEL_OPTS=""
fi
export PARALLEL_OPTS

# Fetch NCBI Metadata:
# Define function to fetch NCBI assembly metadata for a given file. It checks
# if ncbi.json exists or if REPROCESS to force re-fetching.
fetch_ncbi_data() {
  local file="$1"
  local dir=$(dirname "$file")
  local id=$(basename "$dir")
  if [ ! -f "$dir/ncbi.json" ] || [ ! -s "$dir/ncbi.json" ] || [ -n "$REPROCESS" ]; then
    echo "Fetching NCBI data for $id ($(jq -r '.commonName // "Unknown"' "$dir/meta.json"))"

    # Use esearch and esummary to get assembly metadata and save as ncbi.json
    (esearch -db assembly -query "$id" </dev/null | esummary -mode json) >"$dir/ncbi.json"

    # Small delay to avoid overwhelming the NCBI E-utilities
    sleep 0.1
  fi
}

export -f fetch_ncbi_data # Export function for use with GNU Parallel

fd meta.json hubs | parallel -j1 $PARALLEL_OPTS fetch_ncbi_data {}

