#!/bin/bash

export NODE_OPTIONS="--no-warnings=ExperimentalWarning"

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
aws s3 sync --delete --size-only ~/ucscResults s3://jbrowse.org/ucsc/
aws cloudfront create-invalidation --distribution-id E13LGELJOT4GQO --paths "/ucsc/*"
fd config.json ~/ucscResults/ | xargs -I {} bash -c 'cp "{}" configs/"$(basename "$(dirname "{}")").json"'
