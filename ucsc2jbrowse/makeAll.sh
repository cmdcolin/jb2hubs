#!/bin/bash

export NODE_OPTIONS="--no-warnings=ExperimentalWarning"
export PATH=$(pwd):$PATH
mkdir -p ~/ucscResults

./createAssemblies.sh ~/ucsc/*
./createTracksJsonForGoldenPath.sh ~/ucsc/*
./createBedTracksForGoldenPath.sh ~/ucsc/*
./createRmskTracksForGoldenPath.sh ~/ucsc/*
./createGeneTracksForGoldenPath.sh ~/ucsc/*
./createConfigsForGoldenPath.sh ~/ucsc/*
./textIndexGoldenPath.sh ~/ucscResults/*
./addMetadata.sh ~/ucscResults/*
./makeTrackHubConfigs.sh
node src/makeUcscExtensions.ts ~/ucscResults
./downloadNcbiGff.sh
for i in ~/ucsc/*; do
  ./createChainTracks.sh -a $(basename $i)
done

./getFileListing.sh ~/ucscResults/

fd config.json ~/ucscResults/ | grep -v "meta.json" | parallel -I {} 'cp {} configs/$(basename $(dirname {})).json'
node src/mergeAll.ts

npx @biomejs/biome format --write ../
