#!/bin/bash

# Set NODE_OPTIONS to suppress experimental warnings
export NODE_OPTIONS="--no-warnings=ExperimentalWarning"

if [ -t 1 ]; then
  PARALLEL_OPTS="--bar"
else
  PARALLEL_OPTS=""
fi
export PARALLEL_OPTS

# Define function to process a single GFF file. It handles cases where start >
# end, sorts, bgzips, and tabix indexes the GFF.
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
    jbrowse sort-gff "$unzipped_file" | bgzip -@2 >"$output_bgz_file"
    tabix -C "$output_bgz_file"
    rm "$unzipped_file" # Clean up unzipped file
  fi
}

export -f process_gff_file # Export function for use with GNU Parallel

find gff -name "*.gz" -print0 | parallel -0 -j8 $PARALLEL_OPTS process_gff_file
