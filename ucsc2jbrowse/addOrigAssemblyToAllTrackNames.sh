#!/bin/bash
set -e

if [ -z "$UCSC_RESULTS_DIR" ]; then
  echo "Error: UCSC_RESULTS_DIR environment variable is not set."
  exit 1
fi

find "$UCSC_RESULTS_DIR" -type f -name "config.json" | while read -r config_file; do
  echo "Processing $config_file"
  node src/addOrigAssemblyToTrackName.ts "$config_file"
done
