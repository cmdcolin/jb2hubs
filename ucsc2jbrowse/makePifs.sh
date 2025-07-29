#!/bin/bash

# Set the root directory for UCSC data and results.
# Can be overridden by setting the environment variable.
: ${UCSC_DATA_DIR:=~/ucsc}
: ${UCSC_RESULTS_DIR:=~/ucscResults}
export UCSC_RESULTS_DIR

while read -r assembly_path; do
  assembly=$(basename "$assembly_path")
  ./createChainTrackPifs.sh liftOver "$assembly" "$UCSC_RESULTS_DIR"
  ./createChainTrackPifs.sh vs "$assembly" "$UCSC_RESULTS_DIR"
  node src/createChainTracks.ts -a "$assembly" --source liftOver -o "$UCSC_RESULTS_DIR"
  node src/createChainTracks.ts -a "$assembly" --source vs -o "$UCSC_RESULTS_DIR"

done < <(find "$UCSC_DATA_DIR" -maxdepth 1 -mindepth 1 -type d)
