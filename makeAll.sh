#!/bin/bash
export NODE_OPTIONS="--no-warnings=ExperimentalWarning"
node generateHub/downloadHubs.ts
node generateHub/index.ts
./updateNcbiInfo.sh
./makeJBrowseConfigs.sh
node generateHub/makeHubPages.ts
node generateHub/makeGenArkExtensions.ts
yarn format --log-level error .
aws s3 sync hubs s3://jbrowse.org/hubs/genark/ --size-only
