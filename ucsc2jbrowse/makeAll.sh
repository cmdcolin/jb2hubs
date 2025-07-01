#!/bin/bash

export NODE_OPTIONS="--no-warnings=ExperimentalWarning"
export PATH=$(pwd):$PATH
mkdir -p ~/ucscResults
rm -f blockedFiles.txt
curl -s https://api.genome.ucsc.edu/list/ucscGenomes >~/ucscResults/list.json
curl -s https://api.genome.ucsc.edu/list/ucscGenomes | jq . >../website/app/ucsc/list.json

echo "Create initial assemblies for golden path"
./createAssemblies.sh ~/ucsc/*

echo "Extract tracks from trackDb for golden path"
./createTracksJsonForGoldenPath.sh ~/ucsc/*

echo "Create BED tracks for golden path"
./createBedTracksForGoldenPath.sh ~/ucsc/*

echo "Create repeatmasker tracks for golden path"
./createRmskTracksForGoldenPath.sh ~/ucsc/*

echo "Create gene tracks for golden path"
./createGeneTracksForGoldenPath.sh ~/ucsc/*

echo "Create configs for golden path"
./createConfigsForGoldenPath.sh ~/ucsc/*

echo "Text indexing"
./textIndexGoldenPath.sh ~/ucscResults/*

echo "Adding metadata to tracks"
./addMetadata.sh ~/ucscResults/*

echo "Creating trackHub configs"
./makeTrackHubConfigs.sh

echo "Adding non-UCSC 'extension' tracks"
node src/makeUcscExtensions.ts ~/ucscResults

echo "Create hs1 GFF file and index"
./downloadNcbiGff.sh

echo "Create chain tracks"
find ~/ucsc/ -maxdepth 1 -mindepth 1 -type d | parallel -j3 --bar 'node src/createChainTracks.ts -a $(basename {})'

echo "Create pairwise tracks"
find ~/ucsc/ -maxdepth 1 -mindepth 1 -type d | parallel -j3 --bar './createPairwiseChainTracks.sh'
a
echo "Hashing files"
find ~/ucscResults/ -type f | grep -v "meta.json" | grep -v "\.hash" | parallel --bar xxh128sum | sort -k2,2 >fileListing.txt

echo "Copying generated configs files into this repo for version control inspection"
fd config.json ~/ucscResults/ | grep -v "meta.json" | parallel --bar -I {} 'cp {} configs/$(basename $(dirname {})).json'

echo "Merging all configs"
node src/mergeAll.ts

sort -o blockedFiles.txt blockedFiles.txt

npx @biomejs/biome format --write ../
echo "Done!"
