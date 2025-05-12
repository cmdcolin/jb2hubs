#!/bin/bash

rclone sync -c --exclude "*.hash" --exclude "*_meta.json" ~/ucscResults jbrowse-data:jbrowse.org/ucsc
