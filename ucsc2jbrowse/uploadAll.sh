#!/bin/bash

#
# uploadAll.sh
#
# Uploads the JBrowse data to AWS S3 and invalidates the CloudFront cache.
#

set -euo pipefail

# --- Configuration ---

: ${UCSC_RESULTS_DIR:=~/ucscResults}

# --- Main Script ---

echo "Syncing JBrowse data to S3..."
# We use rclone because it has the ability to checksum, compared with plain aws sync (which often will re-upload exact same file, with updated filetime)
rclone sync -c -v --exclude "*.hash" --exclude "*.xxh" --exclude "*_meta.json" "$UCSC_RESULTS_DIR" jbrowse-data:jbrowse.org/ucsc --s3-storage-class INTELLIGENT_TIERING --checkers 20

echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation --distribution-id E13LGELJOT4GQO --paths "/ucsc/*"

echo "Upload complete!"
