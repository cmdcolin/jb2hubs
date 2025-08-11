#!/bin/bash
# set -e

# Set NODE_OPTIONS to suppress experimental warnings
export NODE_OPTIONS="--no-warnings=ExperimentalWarning"

# --- Step 1: Download and Process Hub Data ---

echo "Downloading list of hubs..."
node src/downloadHubList.ts

echo "Downloading actual hub.txt files..."
node src/downloadHubs.ts

echo "Processing hub JSON data..."
node src/processHubJson.ts

# --- Step 2: Fetch NCBI Metadata ---
# Define function to fetch NCBI assembly metadata for a given file.
# It checks if ncbi.json exists or if REPROCESS is set to force re-fetching.
fetch_ncbi_data() {
  local file="$1"
  local dir=$(dirname "$file")
  local id=$(basename "$dir")
  if [ ! -f "$dir/ncbi.json" ] || [ -n "$REPROCESS_NCBI_META" ]; then
    echo "Fetching NCBI data for $id"
    # Use esearch and esummary to get assembly metadata and save as ncbi.json
    (esearch -db assembly -query "$id" </dev/null | esummary -mode json) | grep -v "sortorder" >"$dir/ncbi.json"
    sleep 0.1 # Small delay to avoid overwhelming the NCBI E-utilities
  fi
}

export -f fetch_ncbi_data # Export function for use with GNU Parallel

echo "Fetching NCBI metadata..."
fd meta.json hubs | parallel -j1 --bar fetch_ncbi_data {}

# --- Step 3: Generate JBrowse 2 Configurations ---

echo "Generating JBrowse 2 config.json for each hub..."
fd meta.json hubs | parallel --bar node src/generateConfigs.ts {}

# --- Step 4: Download NCBI GFF Files ---

# Define function to download a single NCBI GFF file.
download_ncbi_gff() {
  local url="$1"
  local filename=$(basename "$url")
  if [ ! -f "gff/$filename" ] || [ -n "$REDOWNLOAD" ]; then
    echo "Downloading GFF file: $filename"
    if [ -n "$REDOWNLOAD" ]; then
      wget -N -q "$url" -P gff
    else
      wget -nc -q "$url" -P gff
    fi
  fi
}

export -f download_ncbi_gff # Export function for use with GNU Parallel

echo "Downloading NCBI GFF files..."
# Extract NCBI GFF URLs from processed JSON and download them
cat processedHubJson/all.json | jq -r ".[].ncbiGff" | grep GCF_ | parallel -j1 --bar download_ncbi_gff

# --- Step 5: Process NCBI GFF Files ---

# Define function to process a single GFF file.
# It handles cases where start > end, sorts, bgzips, and tabix indexes the GFF.
process_gff_file() {
  local input_file="$1"
  local filename=$(basename "$input_file")
  local output_bgz_file="bgz/$filename"
  local unzipped_file="${input_file%.gz}"

  # Check if the bgzipped file already exists or if REPROCESS is set
  if [ ! -f "$output_bgz_file" ] || [ -n "$REPROCESS" ]; then
    echo "Processing GFF file: $filename"
    # Decompress, swap start/end if start > end, then recompress and index
    pigz -dc "$input_file" | awk -F"\t" 'BEGIN{OFS="\t"} {if ($4 >= $5) {temp=$4; $4=$5; $5=temp} print}' >"$unzipped_file"
    jbrowse sort-gff "$unzipped_file" | bgzip -@8 >"$output_bgz_file"
    tabix -C "$output_bgz_file"
    rm "$unzipped_file" # Clean up unzipped file
  fi
}

export -f process_gff_file # Export function for use with GNU Parallel

echo "Processing NCBI GFF files in parallel..."
ls gff/*.gz | parallel --bar -j8 process_gff_file

# --- Step 6: Add GFF Tracks and Text Index to JBrowse 2 Hubs ---

# Define function to add a GFF track to a JBrowse 2 assembly and create a text index.
add_track_and_text_index() {
  local gff_file_path="$1"
  local filename=$(basename "$gff_file_path")
  local accession=$(echo "$filename" | cut -d'_' -f1,2) # e.g., GCF_000896435.1

  # Construct the target hub directory path based on accession
  # Example: hubs/GCF/000/896/435/GCF_000896435.1/
  local prefix=${accession%%_*}   # GCF
  local number=${accession#*_}    # 000896435.1
  local base_number=${number%%.*} # 000896435

  local first_part=${base_number:0:3}
  local second_part=${base_number:3:3}
  local third_part=${base_number:6:3}

  local hub_dir="hubs/$prefix/$first_part/$second_part/$third_part/$accession/"

  jbrowse add-track --force "$gff_file_path" --out "$hub_dir" --load copy --indexFile "${gff_file_path}".csi --trackId ncbiGff --name "RefSeq All - GFF" --category "NCBI RefSeq"

  # Check if trix folder exists
  if [ -d "$hub_dir/trix" ] && [ -z "$REDOWNLOAD" ] && [ -z "$REPROCESS" ]; then
    # Add JSON snippet to config.json using jq
    local config_file="$hub_dir/config.json"
    local temp_file=$(mktemp)

    jq --arg accession "$accession" '. + {
      "aggregateTextSearchAdapters": [
        {
          "type": "TrixTextSearchAdapter",
          "textSearchAdapterId": ($accession + "-index"),
          "ixFilePath": {
            "uri": ("trix/" + $accession + ".ix"),
            "locationType": "UriLocation"
          },
          "ixxFilePath": {
            "uri": ("trix/" + $accession + ".ixx"),
            "locationType": "UriLocation"
          },
          "metaFilePath": {
            "uri": ("trix/" + $accession + "_meta.json"),
            "locationType": "UriLocation"
          },
          "assemblyNames": [$accession]
        }
      ]
    }' "$config_file" >"$temp_file" && mv "$temp_file" "$config_file"
  else
    echo "Trix folder does not exist for $accession, running jbrowse text-index"
    jbrowse text-index --force --out "$hub_dir" --tracks ncbiGff
  fi
}

export -f add_track_and_text_index # Export function for use with GNU Parallel

echo "Loading and text indexing NCBI GFF tracks in parallel..."
find bgz -name "*.gz" | parallel -j 16 --bar add_track_and_text_index

echo "Adding GenArk extensions (special tracks)..."
node src/makeGenArkExtensions.ts

# echo "Generating AI descriptions for species..."
# node src/getAutomatedSpeciesDescription.ts

sleep 1 # Small pause

# --- Step 8: Format Codebase ---

echo "Formatting codebase..."
cd ..
yarn format
cd -
