#!/bin/bash

node generateHub/downloadHubs.ts

node generateHub/index.ts
./updateNcbiInfo.sh
./makeJBrowseConfigs.sh
node generateHub/makeHubPages.ts
node generateHub/makeExtensions.ts
