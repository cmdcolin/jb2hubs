#!/bin/bash

export NODE_OPTIONS="--no-warnings=ExperimentalWarning"

# Download hub.txt into the hubs folder (we mirror them)
# Note: the hubs folder has tons of files
node src/downloadHubList.ts

# Make JBrowse configs
node src/makeJBrowseConfigsFromHubs.ts

# Write info about assembly from NCBI to ncbi.json in hubs folder
fd meta.json hubs | parallel -j1 --bar 'dir=$(dirname {}); id=$(basename $dir); if [ ! -f "$dir/ncbi.json" ]; then (esearch -db assembly -query $id </dev/null | esummary -mode json) >$dir/ncbi.json; sleep 0.1; fi'

# Generate a 'native' jbrowse2 config.json for each hub.txt
fd meta.json hubs | parallel --bar node src/generateConfigs.ts {}

# Make routes in website app folder
node src/makeHubPagesForWebsite.ts

# Add 'extensions' (special tracks)
node src/makeGenArkExtensions.ts

# Format
yarn prettier --log-level error --write ../website/hubs/

# Upload to S3
aws s3 sync hubs s3://jbrowse.org/hubs/genark/ --size-only
