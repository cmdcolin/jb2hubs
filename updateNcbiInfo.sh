#!/bin/bash
set -o pipefail
set -e
fd meta.json hubs | while read p; do
  dir=$(dirname $p)
  id=$(basename $dir)

  # Only run esearch if ncbi.json doesn't exist
  if [ ! -f "$dir/ncbi.json" ]; then
    echo "Processing $id"
    (esearch -db assembly -query $id </dev/null | esummary -mode json) >$dir/ncbi.json
    sleep 0.1
  else
    echo "Skipping $id (ncbi.json already exists)"
  fi
done
