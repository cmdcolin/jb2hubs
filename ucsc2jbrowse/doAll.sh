#!/bin/bash

#
# doAll.sh
#
# Runs the entire UCSC to JBrowse pipeline.
#

set -euo pipefail

export UCSC_RESULTS_DIR=~/ucscResults
./downloadAll.sh
./makeAll.sh
