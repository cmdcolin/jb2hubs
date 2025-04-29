#!/bin/bash

file="$1"

if [ -z "$file" ]; then
  echo "Usage: $0 <filename>"
  exit 1
fi

# Check if the file is already sorted using the specified keys
if sort -c -k1,1 -k2,2n "$file" >/dev/null 2>&1; then
  cat "$file"
else
  sort -k1,1 -k2,2n "$file"
fi
