#!/bin/bash
find ../hubs/ -type f \( -name "*.gff.gz" -o -name "*.ix" \) | parallel --bar ./hash_if_needed.sh {} | sort -k2,2 >fileListing.txt
