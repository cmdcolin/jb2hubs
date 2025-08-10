#!/bin/bash
find ../hubs/ -type f ! -name "*meta.json" ! -name "*.xxh" ! -name "*.hash" | parallel --bar ./hash_if_needed.sh {} | sort -k2,2 >fileListing.txt
