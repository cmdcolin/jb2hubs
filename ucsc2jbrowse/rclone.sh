#!/bin/bash

rclone sync --exclude "*.hash" ~/ucscResults jbrowse-data:jbrowse-org-data/ucsc
