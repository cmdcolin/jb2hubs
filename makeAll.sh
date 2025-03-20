#!/bin/bash

node generateHub/downloadHubs.ts
./makeJBrowseConfigs.sh
./makeHubPages.sh
node generateHub/makeExtensions.ts
