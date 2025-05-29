#!/bin/bash

#!/bin/bash

# Export the function to make it available to parallel
process_file() {
  local i="$1"
  local filename=$(basename "$i")
  local accession=$(echo "$filename" | cut -d'_' -f1,2) # Extract GCF_000896435.1 part

  local prefix=${accession%%_*} # Extract GCF part
  local number=${accession#*_}  # Extract 964355755.1 part
  local number=${number%%.*}    # Remove extension if any to get 964355755

  # Create directory structure
  local first_part=${number:0:3}  # Extract first 3 digits: 964
  local second_part=${number:3:3} # Extract next 3 digits: 355
  local third_part=${number:6:3}  # Extract next 3 digits: 755

  local result="hubs2/$prefix/$first_part/$second_part/$third_part/$accession/"

  # Create the directory if it doesn't exist
  mkdir -p "$result"

  # Run the command with the constructed path
  jbrowse add-track --force "$i" --out "$result" --load copy --indexFile "$i".csi --trackId ncbiGff --name "RefSeq All - All features" --category "NCBI RefSeq"
  jbrowse text-index --force --out "$result" --tracks ncbiGff
}

export -f process_file

# Run the processing in parallel
find bgz -name "*.gz" | parallel -j 16 --bar process_file
