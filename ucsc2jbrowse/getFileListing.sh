#!/bin/bash

# Use the first argument as the directory, or default to current directory if not provided
DIR="${1:-.}"

# Run find on the specified directory
echo "getFileListing"
find "$DIR" -type f | grep -v "meta.json" | grep -v "\.hash" | parallel --bar xxh128sum | sort -k2,2 >fileListing.txt
