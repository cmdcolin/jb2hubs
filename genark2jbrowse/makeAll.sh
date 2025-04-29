#!/bin/bash
export NODE_OPTIONS="--no-warnings=ExperimentalWarning"
node downloadHubs.ts
node makeHubs.ts

# get ncbi json from entrez
fd meta.json hubs | while read p; do
  dir=$(dirname $p)
  id=$(basename $dir)

  # Only run esearch if ncbi.json doesn't exist
  if [ ! -f "$dir/ncbi.json" ]; then
    echo "Fetching NCBI info for $id"
    (esearch -db assembly -query $id </dev/null | esummary -mode json) >$dir/ncbi.json
    sleep 0.1
  # else
  #   echo "Skipping $id (ncbi.json already exists)"
  fi
done

fd meta.json hubs | parallel --bar node generateConfigs.ts {}

node makeHubPages.ts

node makeGenArkExtensions.ts

yarn prettier --log-level error --write ../website/hubs/

aws s3 sync hubs s3://jbrowse.org/hubs/genark/ --size-only
