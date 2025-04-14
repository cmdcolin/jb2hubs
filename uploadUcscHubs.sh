#!/bin/bash
aws s3 sync --exclude "*" --include "**/config.json" ucscHubs s3://jbrowse.org/ucsc
