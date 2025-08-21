#!/bin/bash
set -e

LOG_FILE=$(mktemp)
echo $LOG_FILE

# Run genark2jbrowse/makeAll.sh
echo "Running genark2jbrowse/makeAll.sh..." >>"$LOG_FILE"
(cd genark2jbrowse && ./makeAll.sh && ./uploadAll.sh) >>"$LOG_FILE" 2>&1

# Run ucsc2jbrowse/doAll.sh
echo "Running ucsc2jbrowse/doAll.sh..." >>"$LOG_FILE"
(cd ucsc2jbrowse && ./doAll.sh && ./uploadAll.sh) >>"$LOG_FILE" 2>&1

echo "Running website deploy..." >>"$LOG_FILE"
(cd website && yarn deploy) >>"$LOG_FILE" 2>&1

git add .
git commit -m "Updates"
git push

# Clean up the log file
rm "$LOG_FILE"
