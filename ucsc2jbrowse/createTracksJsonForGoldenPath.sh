#!/bin/bash

#
# createTracksJsonForGoldenPath.sh
#
# Creates the tracks.json file for each assembly.
#

set -euo pipefail

# --- Configuration ---

# Set the root directory for results.
# Can be overridden by setting the environment variable.
: ${OUT:=~/ucscResults}

export LC_ALL=C
export NODE_OPTIONS="--no-warnings=ExperimentalWarning"

# --- Functions ---

# Processes a single assembly.
# $1: The assembly directory in the data folder.
process_assembly() {
  local assembly_data_dir=$1
  local assembly_name
  assembly_name=$(basename "$assembly_data_dir")
  local assembly_results_dir="$OUT/$assembly_name"
  local db_dir="$assembly_data_dir/$assembly_name/database"

  if [[ -f "$db_dir/trackDb.sql" ]]; then
    node src/tracksDbLike.ts "$db_dir/trackDb.sql" "$db_dir/trackDb.txt.gz" >"$assembly_results_dir/tracks.json"

    # Find bigBed/bigWig files in the tracks.json, these do not have sql db files
    node src/mergeBigFileTracks.ts "$assembly_results_dir/tracks.json" "$assembly_results_dir/config.json"
  fi
}

export -f process_assembly
export OUT

# --- Main Script ---

if [ $# -eq 0 ]; then
  echo "Usage: $0 <assembly_data_dir1> [assembly_data_dir2] ..."
  exit 1
fi

parallel --bar --will-cite process_assembly ::: "$@"
