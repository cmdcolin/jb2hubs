#!/bin/bash
aws s3 sync --exclude "*" --include "**/config.json" s3://jbrowse.org/ucsc ucscHubs
