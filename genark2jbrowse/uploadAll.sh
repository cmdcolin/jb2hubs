#!/bin/bash

# Sync the 'hubs' directory to the S3 bucket, only uploading new or changed files.
# The --size-only flag compares files by size, which is faster for large syncs.
aws s3 sync hubs s3://jbrowse.org/hubs/genark/ --size-only --exclude "*.meta.json"
# Invalidate the CloudFront cache for the '/hubs/*' path.
# This ensures that users get the latest content from S3.
aws cloudfront create-invalidation --distribution-id E13LGELJOT4GQO --paths "/hubs/*"
