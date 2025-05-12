#!/bin/bash

export NODE_OPTIONS="--no-warnings=ExperimentalWarning"
export PATH=$(pwd):$PATH
mkdir -p ~/ucscResults

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

for i in ~/ucsc/*; do
  ./generateChainTracks.sh -a $(basename $i)
done

fd config.json ~/ucscResults/ | grep -v "meta.json" | parallel -I {} 'cp {} configs/$(basename $(dirname {})).json'
yarn prettier --write .
