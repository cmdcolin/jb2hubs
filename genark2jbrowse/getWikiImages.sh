#!/bin/bash

export NODE_OPTIONS="--no-warnings=ExperimentalWarning"
# Script to process Wikipedia images for all species in parallel using GNU parallel

# Configuration
INPUT_FILE="processedHubJson/all.json"
SCRIPT_PATH="src/getWikiImage.ts"
# Extract scientific names from JSON using jq and process in parallel
process_wiki_image() {
  local scientific_name="$1"
  local accession="$2"

  # Construct the target hub directory path based on accession
  # Example: hubs/GCF/000/896/435/GCF_000896435.1/
  local prefix=${accession%%_*}   # GCF
  local number=${accession#*_}    # 000896435.1
  local base_number=${number%%.*} # 000896435

  local first_part=${base_number:0:3}
  local second_part=${base_number:3:3}
  local third_part=${base_number:6:3}

  local hub_dir="hubs/$prefix/$first_part/$second_part/$third_part/$accession/"

  if [[ ! -f "$hub_dir/image.json" && ! -f "$hub_dir/image.json.notfound" && "$scientific_name" != "null" ]]; then
    echo "Fetching $scientific_name $accession"
    node src/getWikiImage.ts "$scientific_name" "$accession"
    sleep 0.1
  fi
}

export -f process_wiki_image

if [ -t 1 ]; then
  PARALLEL_OPTS="-j 1 --colsep '\t'"
else
  PARALLEL_OPTS="-j 1 --bar --colsep '\t'"
fi

jq -r '.[] | select(. != null) | "\(.scientificName)\t\(.accession)"' "$INPUT_FILE" |
  parallel $PARALLEL_OPTS "process_wiki_image {1} {2}"
