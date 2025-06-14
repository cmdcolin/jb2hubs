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

echo "Create hs1 GFF file and index"
./downloadNcbiGff.sh

echo "Create chain tracks"
find ~/ucsc/* -type d -maxdepth 0 | parallel --bar -I {} './createChainTracks.sh -a $(basename {})'

echo "Hashing files"
find ~/ucscResults/ -type f | grep -v "meta.json" | grep -v "\.hash" | parallel --bar xxh128sum | sort -k2,2 >fileListing.txt

echo "Copying generated configs files into this repo for version control inspection"
fd config.json ~/ucscResults/ | grep -v "meta.json" | parallel --bar -I {} 'cp {} configs/$(basename $(dirname {})).json'

echo "Merging all configs"
node src/mergeAll.ts

npx @biomejs/biome format --write ../
