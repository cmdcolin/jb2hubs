#!/bin/bash

aws s3 sync hubs s3://jbrowse.org/hubs/genark/ --size-only
# aws cloudfront create-invalidation --distribution-id E13LGELJOT4GQO --paths "/hubs/*"
