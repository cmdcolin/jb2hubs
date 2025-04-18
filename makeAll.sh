#!/bin/bash
export NODE_OPTIONS="--no-warnings=ExperimentalWarning"
node generateHub/downloadHubs.ts
node generateHub/index.ts
./updateNcbiInfo.sh
./makeJBrowseConfigs.sh
node generateHub/makeHubPages.ts
node generateHub/makeGenArkExtensions.ts
yarn format --log-level error .
