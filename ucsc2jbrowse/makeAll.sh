#!/bin/bash

export NODE_OPTIONS="--no-warnings=ExperimentalWarning"
export PATH=$(pwd):$PATH
mkdir -p ~/ucscResults

time ./makeTrackHubConfigs.sh
time ./createAssemblies.sh ~/ucsc/*
time ./createTracksJsonForGoldenPath.sh ~/ucsc/*
time ./createBedTracksForGoldenPath.sh ~/ucsc/*
time ./createRmskTracksForGoldenPath.sh ~/ucsc/*
time ./createGeneTracksForGoldenPath.sh ~/ucsc/*
time ./createConfigsForGoldenPath.sh ~/ucsc/*
time ./textIndexGoldenPath.sh ~/ucscResults/*
time ./addMetadata.sh ~/ucscResults/*
time node src/makeUcscExtensions.ts ~/ucscResults

for i in ~/ucsc/*; do
  ./createChainTracks.sh -a $(basename $i)
done
time ./getFileListing.sh ~/ucscResults/

time fd config.json ~/ucscResults/ | grep -v "meta.json" | parallel -I {} 'cp {} configs/$(basename $(dirname {})).json'
time node src/mergeAll.ts

npx @biomejs/biome format --write ../
