#!/bin/bash
set -o pipefail
set -e
fd meta.json hubs | while read p; do
  dir=$(dirname $p)
  id=$(basename $dir)
  echo $id
  (esearch -db assembly -query $id | esummary -mode json) >$dir/ncbi.json
  sleep 0.1
done
