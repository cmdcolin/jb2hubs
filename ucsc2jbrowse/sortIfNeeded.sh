#!/bin/bash

#
# sortIfNeeded.sh
#
# Sorts a file if it is not already sorted.
#

set -euo pipefail

# --- Main Script ---

if [ $# -eq 0 ]; then
  echo "Usage: $0 <filename>"
  exit 1
fi

file="$1"

# Check if the file is already sorted using the specified keys
if sort -c -k1,1 -k2,2n "$file" >/dev/null 2>&1; then
  cat "$file"
else
  sort -k1,1 -k2,2n "$file"
fi
