#!/bin/bash

export NODE_OPTIONS="--no-warnings=ExperimentalWarning"
export PATH=$(pwd):$PATH
mkdir -p ~/ucscResults
curl https://api.genome.ucsc.edu/list/ucscGenomes >~/ucscResults/list.json
./downloadGoldenpath.sh ~/ucsc
./createAssemblies.sh ~/ucsc/*
./createTracksJsonForGoldenPath.sh ~/ucsc/*
./createBedTracksForGoldenPath.sh ~/ucsc/*
./createRmskTracksForGoldenPath.sh ~/ucsc/*
./createGeneTracksForGoldenPath.sh ~/ucsc/*
./createCoreTracksForHs1.sh ~/ucsc/*
./createConfigsForGoldenPath.sh ~/ucsc/*
./textIndexGoldenPath.sh ~/ucscResults/*
./addMetadata.sh ~/ucscResults/*
node src/makeUcscExtensions.ts ~/ucscResults
./getFileListing.sh ~/ucscResults/

aws s3 sync --delete --exclude="*meta.json" --exclude "*.hash" ~/ucscResults s3://jbrowse.org/ucsc/

aws cloudfront create-invalidation --distribution-id E13LGELJOT4GQO --paths "/ucsc/*"
fd config.json ~/ucscResults/ | parallel -I {} 'cp {} configs/$(basename $(dirname {})).json'

yarn prettier --write .
