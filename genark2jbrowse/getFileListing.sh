#!/bin/bash
find ../hubs/ -type f ! -name "*meta.json" ! -name "*.xxh" ! -name "*.hash" ! -name "*.ix" ! -name "*.ixx" ! -name "*.notfound" ! -name "*image.json" ! -name "*hub.txt" | parallel --bar ./hash_if_needed.sh {} | sort -k2,2 >fileListing.txt
