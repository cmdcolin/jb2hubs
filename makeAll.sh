#!/bin/bash

node generateHub/downloadHubs.ts

node generateHub/index.ts
./ncbi.sh
./makeJBrowseConfigs.sh
./makeHubPages.sh
node generateHub/makeExtensions.ts
