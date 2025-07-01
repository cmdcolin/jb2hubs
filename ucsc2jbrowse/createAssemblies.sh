#!/bin/bash

#
# createAssemblies.sh
#
# Creates the initial JBrowse configuration file for each assembly.
#

set -euo pipefail

# --- Configuration ---

# Set the root directory for results.
# Can be overridden by setting the environment variable.
: ${OUT:=~/ucscResults}

export LC_ALL=C

# --- Functions ---

# Processes a single assembly.
# $1: The assembly directory in the data folder.
process_assembly() {
  local assembly_data_dir=$1
  local assembly_name
  assembly_name=$(basename "$assembly_data_dir")
  local assembly_results_dir="$OUT/$assembly_name"

  mkdir -p "$assembly_results_dir"
  echo "Creating assembly config for $assembly_name..."
  node src/createAssembly.ts "$assembly_name" "$OUT/list.json" >"$assembly_results_dir/config.json"
}

export -f process_assembly
export OUT

# --- Main Script ---

if [ $# -eq 0 ]; then
  echo "Usage: $0 <assembly_data_dir1> [assembly_data_dir2] ..."
  exit 1
fi

# Use GNU parallel to process assemblies in parallel.
parallel --bar process_assembly ::: "$@"
