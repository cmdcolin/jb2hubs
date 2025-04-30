#!/bin/bash

export NODE_OPTIONS="--no-warnings=ExperimentalWarning"
export PATH=$(pwd):$PATH

./downloadGoldenpath.sh ~/ucsc
./createAssemblies.sh ~/ucsc/*
./createTracksJsonForGoldenPath.sh ~/ucsc/*
./createBedTracksForGoldenPath.sh ~/ucsc/*
./createRmskTracksForGoldenPath.sh ~/ucsc/*
./createGeneTracksForGoldenPath.sh ~/ucsc/*
./createCoreTracksForHs1.sh ~/ucsc/*
./createConfigsForGoldenPath.sh ~/ucsc/*
./createTabixIndexes.sh ~/ucscResults/
./textIndexGoldenPath.sh ~/ucscResults/*
./addMetadata.sh ~/ucscResults/*
node src/makeUcscExtensions.ts ~/ucscResults
./getFileListing.sh ~/ucscResults/

## size only on most...would be good to avoid this but it updates based on file times
aws s3 sync --delete --size-only ~/ucscResults s3://jbrowse.org/ucsc/
## include indexes without size-only
aws s3 sync --delete --exclude="*" --include="*.csi" ~/ucscResults s3://jbrowse.org/ucsc/

aws cloudfront create-invalidation --distribution-id E13LGELJOT4GQO --paths "/ucsc/*"
fd config.json ~/ucscResults/ | xargs -I {} bash -c 'cp "{}" configs/"$(basename "$(dirname "{}")").json"'
yarn prettier --write .
