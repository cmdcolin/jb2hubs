#!/bin/bash

# use size-only for most everything, hope that things don't differ by 1 byte...
aws s3 sync --delete --size-only --exclude="*meta.json" --exclude "*.hash" ~/ucscResults s3://jbrowse.org/ucsc/

# don't use size-only for csi files, because they sometimes do only differ by 1 byte
aws s3 sync --delete --exclude="*" --include "*.csi" ~/ucscResults s3://jbrowse.org/ucsc/

aws cloudfront create-invalidation --distribution-id E13LGELJOT4GQO --paths "/ucsc/*"
