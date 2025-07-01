#!/bin/bash

#
# doAll.sh
#
# Runs the entire UCSC to JBrowse pipeline.
#

set -euo pipefail

./downloadAll.sh
./makeAll.sh
