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

echo "Text indexing"
./textIndexGoldenPath.sh ~/ucscResults/*
echo "---------------"

echo "Adding metadata to tracks"
./addMetadata.sh ~/ucscResults/*
echo "---------------"

echo "Creating trackHub configs"
./makeTrackHubConfigs.sh
echo "---------------"

echo "Adding non-UCSC 'extension' tracks"
node src/makeUcscExtensions.ts ~/ucscResults
echo "---------------"

echo "Create hs1 GFF file and index"
./downloadNcbiGff.sh
echo "---------------"

echo "Create chain tracks"
find ~/ucsc/ -maxdepth 1 -mindepth 1 -type d | parallel -j3 --bar './createChainTracks.sh -a $(basename {})'
echo "---------------"

echo "Hashing files"
find ~/ucscResults/ -type f | grep -v "meta.json" | grep -v "\.hash" | parallel --bar xxh128sum | sort -k2,2 >fileListing.txt
echo "---------------"

echo "Copying generated configs files into this repo for version control inspection"
fd config.json ~/ucscResults/ | grep -v "meta.json" | parallel --bar -I {} 'cp {} configs/$(basename $(dirname {})).json'
echo "---------------"

echo "Merging all configs"
node src/mergeAll.ts

npx @biomejs/biome format --write ../
