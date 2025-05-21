#!/bin/bash

# We use rclone because it has the ability to checksum, compared with plain aws sync (which often will re-upload exact same file, with updated filetime)
rclone sync -c -v --exclude "*.hash" --exclude "*_meta.json" ~/ucscResults jbrowse-data:jbrowse.org/ucsc

aws cloudfront create-invalidation --distribution-id E13LGELJOT4GQO --paths "/ucsc/*"
