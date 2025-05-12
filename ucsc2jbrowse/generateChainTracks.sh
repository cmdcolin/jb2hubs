#!/bin/bash

# Script to generate chain tracks for a specified assembly

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
mkdir -p "$OUT/${SOURCE_ASSEMBLY}"

# Path to the config file
CONFIG_FILE="$OUT/$SOURCE_ASSEMBLY/config.json"

# Create config file with empty tracks array if it doesn't exist
if [ ! -f "$CONFIG_FILE" ]; then
  echo '{"tracks":[]}' >"$CONFIG_FILE"
fi

# Temporary file to store chain tracks
TEMP_TRACKS_FILE=$(mktemp)
echo "[]" >"$TEMP_TRACKS_FILE"

echo "Fetching chain files for $SOURCE_ASSEMBLY from UCSC..."
wget -q -O - "https://hgdownload.soe.ucsc.edu/goldenPath/$SOURCE_ASSEMBLY/liftOver/" | grep -o 'href="[^"]*"' | sed "s!href=\"\(.*\)\"!https://hgdownload.soe.ucsc.edu/goldenPath/$SOURCE_ASSEMBLY/liftOver/\1!" | grep -v md5sum | grep .chain.gz | while read p; do
  echo "Processing $p"

  # Extract the filename from the URL
  filename=$(basename "$p")

  # Parse the filename to get the source and target assemblies
  # Format is typically sourceToTarget.over.chain.gz (e.g., hg19ToSom1.over.chain.gz)
  if [[ $filename =~ ^([^T]+)To([^.]+)\.over\.chain\.gz$ ]]; then
    source_assembly="${BASH_REMATCH[1]}"
    # Extract target assembly and ensure first letter is lowercase
    target_assembly_orig="${BASH_REMATCH[2]}"
    target_assembly="$(echo ${target_assembly_orig:0:1} | tr '[:upper:]' '[:lower:]')${target_assembly_orig:1}"

    # Create a track ID and name
    track_id="${source_assembly}_to_${target_assembly}_chain"
    track_name="${source_assembly} to ${target_assembly} Chain"

    # Create the JSON for this track
    track_json=$(
      cat <<EOF
{
  "type": "SyntenyTrack",
  "trackId": "${track_id}",
  "name": "${track_name}",
  "category":["Liftover"],
  "assemblyNames": [
    "${source_assembly}"
  ],
  "adapter": {
    "type": "ChainAdapter",
    "targetAssembly": "${source_assembly}",
    "queryAssembly": "${target_assembly}",
    "uri": "${p}"
  }
}
EOF
    )

    # Add this track to the temporary JSON array
    temp_file=$(mktemp)
    jq --argjson new_track "$track_json" '. += [$new_track]' "$TEMP_TRACKS_FILE" >"$temp_file"
    mv "$temp_file" "$TEMP_TRACKS_FILE"

    echo "Added track for ${source_assembly} to ${target_assembly}"
  else
    echo "Warning: Could not parse filename format for $filename"
  fi
done

# Now append all the chain tracks to the config.json file
echo "Appending chain tracks to $CONFIG_FILE..."
CHAIN_TRACKS=$(cat "$TEMP_TRACKS_FILE")
temp_file=$(mktemp)
jq --argjson chain_tracks "$CHAIN_TRACKS" '.tracks += $chain_tracks' "$CONFIG_FILE" >"$temp_file"
mv "$temp_file" "$CONFIG_FILE"

# Clean up temporary file
rm "$TEMP_TRACKS_FILE"

echo "Chain tracks have been appended to $CONFIG_FILE"
