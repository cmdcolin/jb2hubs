#!/bin/bash
file="$1"
hashfile="$file.xxh"

if [ ! -f "$hashfile" ] || [ "$file" -nt "$hashfile" ]; then
  xxh32sum "$file" >"$hashfile"
fi
cat "$hashfile"
