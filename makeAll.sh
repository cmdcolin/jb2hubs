#!/bin/bash

node generateHub/downloadHubs.ts

node generateHub/index.ts
./makeJBrowseConfigs.sh
./makeHubPages.sh
node generateHub/makeExtensions.ts
