#!/bin/bash

## get latest listing
curl -O https://hgdownload.soe.ucsc.edu/hubs/UCSC_GI.assemblyHubList.txt

## generate hubs from latest listing
node generateHub/index.ts UCSC_GI.assemblyHubList.txt
