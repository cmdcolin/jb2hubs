#!/bin/bash

find hubs -name meta.json | parallel -I {} sh -c '>&2 echo {} && node generateHub/generateConfigs.ts {} 2>> errors.log'
