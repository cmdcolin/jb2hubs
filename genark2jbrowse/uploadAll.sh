#!/bin/bash

# Sync the 'hubs' directory to the S3 bucket, only uploading new or changed files.
# The --size-only flag compares files by size, which is faster for large syncs.
rclone sync -c -v --exclude "*.hash" --exclude "*.xxh" --exclude "*meta.json" --exclude "*ncbi.json" hubs jbrowse-data:jbrowse.org/hubs/genark

# Invalidate the CloudFront cache for the '/hubs/*' path.
# This ensures that users get the latest content from S3.
# aws cloudfront create-invalidation --distribution-id E13LGELJOT4GQO --paths "/hubs/*"
