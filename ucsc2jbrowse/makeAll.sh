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
./generateChainTracks.sh
fd config.json ~/ucscResults/ | grep -v "meta.json" | parallel -I {} 'cp {} configs/$(basename $(dirname {})).json'
yarn prettier --write .
