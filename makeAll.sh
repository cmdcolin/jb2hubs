#!/bin/bash

./downloadUcscHubs.sh
node generateHub/downloadHubs.ts
node generateHub/index.ts
./updateNcbiInfo.sh
./makeJBrowseConfigs.sh
node generateHub/makeHubPages.ts
node generateHub/makeGenArkExtensions.ts
yarn format
./uploadUcscHubs.sh
