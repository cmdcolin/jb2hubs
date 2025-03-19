#!/bin/bash

./downloadHubs.sh
./makeJBrowseConfigs.sh
./makeHubPages.sh
node generateHub/makeExtensions.ts
