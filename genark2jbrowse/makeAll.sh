#!/bin/bash

export NODE_OPTIONS="--no-warnings=ExperimentalWarning"

# Download list of hubs (in json)
node src/downloadHubList.ts

# Download actual hub.txt files
node src/downloadHubs.ts

# Process hubJson
node src/processHubJson.ts

# Write info about assembly from NCBI to ncbi.json in hubs folder
# Define function to fetch NCBI data
fetch_ncbi_data() {
  local file="$1"
  local dir=$(dirname "$file")
  local id=$(basename "$dir")
  if [ ! -f "$dir/ncbi.json" ] || [ -n "$REPROCESS" ]; then
    echo "$id"
    (esearch -db assembly -query "$id" </dev/null | esummary -mode json) >"$dir/ncbi.json"
    sleep 0.1
  fi
}

export -f fetch_ncbi_data

# Run the function in parallel
echo "Fetch NCBI metadata"
fd meta.json hubs | parallel -j1 --bar fetch_ncbi_data {}

# Generate a 'native' jbrowse2 config.json for each hub.txt
echo "Generate configs"
fd meta.json hubs | parallel --bar node src/generateConfigs.ts {}

#  if REDOWNLOAD is defined, then rm -rf gff folder to force redownloading of
#  all GFF files
if [ -n "$REDOWNLOAD" ]; then
  echo "REDOWNLOAD is set, removing gff folder to force redownloading all GFF files"
  rm -rf gff
  mkdir -p gff
fi

echo "Download NCBI GFF"
cat processedHubJson/all.json | jq -r ".[].ncbiGff" | grep GCF_ | parallel -j1 --bar "wget -nc -q {} -P gff"

# process NCBI GFF
process_gff_file() {
  local input_file="$1"
  local filename=$(basename "$input_file")

  # swaps start and end if start > end, could be worth investigating more but a
  # number of NCBI GFF have this
  if [ ! -f "bgz/$filename" ] || [ -n "$REPROCESS" ]; then
    pigz -dc "$input_file" | awk -F"\t" 'BEGIN{OFS="\t"} {if ($4 >= $5) {temp=$4; $4=$5; $5=temp} print}' >"${input_file%.gz}"
    jbrowse sort-gff "${input_file%.gz}" | bgzip -@8 >"bgz/$filename"
    tabix -C "bgz/$filename"
    rm "${input_file%.gz}"
  fi
}

export -f process_gff_file

echo "Process NCBI GFF"
ls gff/*.gz | parallel --bar -j8 process_gff_file

# Export the function to make it available to parallel
add_track_and_text_index() {
  local i="$1"
  local filename=$(basename "$i")
  local accession=$(echo "$filename" | cut -d'_' -f1,2) # Extract GCF_000896435.1 part

  local prefix=${accession%%_*} # Extract GCF part
  local number=${accession#*_}  # Extract 964355755.1 part
  local number=${number%%.*}    # Remove extension if any to get 964355755

  local first_part=${number:0:3}  # Extract first 3 digits: 964
  local second_part=${number:3:3} # Extract next 3 digits: 355
  local third_part=${number:6:3}  # Extract next 3 digits: 755

  local result="hubs/$prefix/$first_part/$second_part/$third_part/$accession/"

  jbrowse add-track --force "$i" --out "$result" --load copy --indexFile "$i".csi --trackId ncbiGff --name "RefSeq All - GFF" --category "NCBI RefSeq"
  jbrowse text-index --force --out "$result" --tracks ncbiGff
}

export -f add_track_and_text_index

# Load NCBI GFF
echo "Load and text index NCBI GFF"
find bgz -name "*.gz" | parallel -j 16 --bar add_track_and_text_index

# Make routes in website app folder
node src/makeHubPagesForWebsite.ts

# Add 'extensions' (special tracks)
node src/makeGenArkExtensions.ts

# AI descriptions
node src/getAutomatedSpeciesDescription.ts

sleep 1

# Format
npx @biomejs/biome format --write ../
