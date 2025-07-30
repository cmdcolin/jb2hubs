#!/bin/bash

# Set the root directory for UCSC data and results.
# Can be overridden by setting the environment variable.
: ${UCSC_DATA_DIR:=~/ucsc}
: ${UCSC_RESULTS_DIR:=~/ucscResults}
export UCSC_RESULTS_DIR

find "$UCSC_DATA_DIR" -maxdepth 1 -mindepth 1 -type d | parallel --bar -j+0 '
  assembly=$(basename "{}")
  ./createChainTrackPifs.sh liftOver "$assembly" "$UCSC_RESULTS_DIR"
  ./createChainTrackPifs.sh vs "$assembly" "$UCSC_RESULTS_DIR"
'

find "$UCSC_DATA_DIR" -maxdepth 1 -mindepth 1 -type d | parallel --bar -j+0 '
  assembly=$(basename "{}")
  node src/createChainTracks.ts -a "$assembly" --source liftOver -o "$UCSC_RESULTS_DIR"
  node src/createChainTracks.ts -a "$assembly" --source vs -o "$UCSC_RESULTS_DIR"
'
