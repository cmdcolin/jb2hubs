#!/bin/bash

find hubs -name meta.txt | parallel -I {} sh -c '>&2 echo {} && node generateHub/generateConfigs.ts {} 2>> errors.log'
