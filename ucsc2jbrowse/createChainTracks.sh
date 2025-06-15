#!/bin/bash

# Script to generate chain tracks for a specified assembly
# Downloads chain files, converts to PAF, creates PIF files, and adds to JBrowse config

# Function to display usage information
usage() {
  echo "Usage: $0 [options]"
  echo "Options:"
  echo "  -a, --assembly ASSEMBLY  Source assembly name (e.g., hg19, hg38, mm10)"
  echo "  -o, --output DIR         Output directory (default: ~/ucscResults)"
  echo "  -h, --help               Display this help message"
  exit 1
}

# Parse command line arguments
SOURCE_ASSEMBLY="hg19" # Default assembly
while [[ $# -gt 0 ]]; do
  case $1 in
  -a | --assembly)
    SOURCE_ASSEMBLY="$2"
    shift 2
    ;;
  -o | --output)
    OUT="$2"
    shift 2
    ;;
  -h | --help)
    usage
    ;;
  *)
    echo "Unknown option: $1"
    usage
    ;;
  esac
done

# Set default output directory if not already set
: ${OUT:=~/ucscResults}
CONFIG_DIR="$OUT/$SOURCE_ASSEMBLY"
mkdir -p "$CONFIG_DIR"

# Path to the config file
CONFIG_FILE="$CONFIG_DIR/config.json"

# Create config file with empty tracks array if it doesn't exist
if [ ! -f "$CONFIG_FILE" ]; then
  echo '{"tracks":[]}' >"$CONFIG_FILE"
fi

# Temporary file to store chain tracks
TEMP_TRACKS_FILE=$(mktemp)
echo "[]" >"$TEMP_TRACKS_FILE"

# Create a temporary directory for parallel processing
TEMP_DIR=$(mktemp -d)
trap 'rm -rf "$TEMP_DIR"' EXIT

mkdir -p "chains"
mkdir -p "pifs"
# Create a function to process each chain file
process_chain_file() {
  local p="$1"
  local temp_tracks_file="$2"
  local config_dir="$3"
  local source_assembly="$4"

  # Extract the filename from the URL
  filename=$(basename "$p")
  filename2=$(basename "$p" .chain.gz)
  # Create chains directory if it doesn't exist
  # Download only if the file doesn't exist
  if [ ! -f "chains/$filename" ]; then
    wget -q -O "chains/$filename.tmp" "$p" && mv "chains/$filename.tmp" "chains/$filename"
  fi

  # Create pif file if does not exist
  if [ ! -f "pifs/$filename2.pif.gz" ]; then
    pigz -dc "chains/$filename" | chain2paf --input /dev/stdin >"$TEMP_DIR/$filename.paf"
    jbrowse make-pif "$TEMP_DIR/$filename.paf" --csi --out "pifs/$filename2.pif.gz"
  fi
  cp "pifs/$filename2.pif.gz" "$config_dir"
  cp "pifs/$filename2.pif.gz.csi" "$config_dir"

  # Parse the filename to get the source and target assemblies
  # Format is typically sourceToTarget.over.chain.gz (e.g., hg19ToSom1.over.chain.gz)
  if [[ $filename =~ ^(.+?)To(.+?)\.over\.chain\.gz$ ]]; then
    source_assembly="${BASH_REMATCH[1]}"
    # Extract target assembly and ensure first letter is lowercase
    target_assembly_orig="${BASH_REMATCH[2]}"
    if [[ $target_assembly_orig == GCF* || $target_assembly_orig == GCA* ]]; then
      target_assembly="${target_assembly_orig}"
    else
      target_assembly="$(echo ${target_assembly_orig:0:1} | tr '[:upper:]' '[:lower:]')${target_assembly_orig:1}"
    fi

    # Read the processedHubJson/all.json file to get the common name for the target
    # assembly if it's an accession
    common_name=""
    if [[ $target_assembly_orig == GCF* || $target_assembly_orig == GCA* ]]; then
      common_name=$(jq -r --arg acc "$target_assembly_orig" '.[] | select(.accession == $acc) | .commonName' "../website/processedHubJson/all.json" | head -n 1)
    else
      common_name=$(jq -r --arg assembly "$target_assembly" '.ucscGenomes[$assembly].organism // empty' ~/ucscResults/list.json)
    fi

    # Create a track ID and name
    track_id="${source_assembly}_to_${target_assembly}_chain"
    if [ -n "$common_name" ]; then
      track_name="${source_assembly} to ${common_name} (${target_assembly}) liftOver chain"
    else
      track_name="${source_assembly} to ${target_assembly} liftOver chain"
    fi

    # Create the JSON for this track
    track_json=$(
      cat <<EOF
{
  "type": "SyntenyTrack",
  "trackId": "${track_id}",
  "name": "${track_name}",
  "category":["Liftover"],
  "assemblyNames": ["${source_assembly}","${target_assembly}"],
  "adapter": {
    "type": "PairwiseIndexedPAFAdapter",
    "targetAssembly": "${source_assembly}",
    "queryAssembly": "${target_assembly}",
    "pifGzLocation": {"uri":"${p}"},
    "index":{"location":{"uri":"${p}.csi"}}
  }
}
EOF
    )

    # Create a unique temporary file for this process
    local track_file="$TEMP_DIR/track_$(basename "$p").json"
    echo "$track_json" >"$track_file"
  else
    echo "Warning: Could not parse filename format for $filename"
  fi
}

# Export the function and variables so parallel can use them
export -f process_chain_file
export TEMP_DIR CONFIG_DIR SOURCE_ASSEMBLY

# Get list of chain files
chain_files=$(wget -q -O - "https://hgdownload.soe.ucsc.edu/goldenPath/$SOURCE_ASSEMBLY/liftOver/" | grep -o 'href="[^"]*"' | sed "s!href=\"\(.*\)\"!https://hgdownload.soe.ucsc.edu/goldenPath/$SOURCE_ASSEMBLY/liftOver/\1!" | grep -v md5sum | grep .chain.gz)

# Process chain files in parallel
if [ -n "$chain_files" ]; then
  echo "$chain_files" | parallel -j8 --will-cite process_chain_file {} "$TEMP_TRACKS_FILE" "$CONFIG_DIR" "$SOURCE_ASSEMBLY"
else
  echo "No chain files found for $SOURCE_ASSEMBLY"
fi
# Combine all the individual track JSON files into the temporary tracks file
find "$TEMP_DIR" -name "track_*.json" -print0 | xargs -0 cat | jq -s '.' >"$TEMP_TRACKS_FILE"

# Now append all the chain tracks to the config.json file
# echo "Appending chain tracks to $CONFIG_FILE..."
CHAIN_TRACKS=$(cat "$TEMP_TRACKS_FILE")
temp_file=$(mktemp)
jq --argjson chain_tracks "$CHAIN_TRACKS" '.tracks += $chain_tracks' "$CONFIG_FILE" >"$temp_file"
mv "$temp_file" "$CONFIG_FILE"

# Clean up temporary file
rm "$TEMP_TRACKS_FILE"

# echo "Chain tracks have been appended to $CONFIG_FILE"
