#!/bin/bash

rm -rf app/hubs/

cut -f6 UCSC_GI.assemblyHubList.txt | grep -v "^#" | sed -e 's/(L)//' | sort | uniq | grep -v "GenArk" | while read p; do
  echo $p
  mkdir -p app/hubs/$p
  node generateHub/makeHubPage.ts $p
done
