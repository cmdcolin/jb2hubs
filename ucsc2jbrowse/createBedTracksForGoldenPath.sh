#!/bin/bash
export LC_ALL=C
export NODE_OPTIONS="--no-warnings=ExperimentalWarning"

# Set default value for OUT if not already set
: ${OUT:=~/ucscResults}

# Function to process a single assembly
process_assembly() {
  local INDIR=$1
  local ASM=$(basename $INDIR)
  local OUTDIR=$OUT/$ASM
  local DB=$INDIR/$ASM/database

  # make bed.gz files from "regular bed" sql db tracks
  if [ -f "$OUTDIR/tracks.json" ]; then
    TRACKS_JSON="$OUTDIR/tracks.json"
    DBDIR="$DB"

    # Define track types to process
    # Commented out types that would result in many narrow/broad peak tracks
    # TYPES='"bed", "narrowPeak", "broadPeak", "pgSnp", "peptideMapping"'
    TYPES='"bed", "pgSnp", "peptideMapping"'

    # Process each track that matches our types
    jq -r "to_entries | map(select(.value.type | startswith(\"bed\") or startswith(\"pgSnp\") or startswith(\"peptideMapping\"))) | map(.key) | .[]" "$TRACKS_JSON" | while read -r key; do
      # Skip tracks that start with "snp" or "wgEncode" (these are large and numerous)
      if [[ "$key" == snp* ]] || [[ "$key" == wgEncode* ]]; then
        continue
      fi

      infile="$DBDIR/$key"
      outfile="$OUTDIR/$key"

      # Check if SQL file exists
      if [ -f "${infile}.sql" ]; then

        # Create hash file path
        hash_file="${outfile}.hash"

        # Calculate current hash of the input file
        current_hash=$(xxh128sum "${infile}.txt.gz" | awk '{print $1}')

        # Check if we need to process the file
        need_processing=true
        if [ -f "${outfile}.bed.gz" ] && [ -f "$hash_file" ] && [ -z "${REPROCESS}" ]; then
          stored_hash=$(cat "$hash_file")
          if [ "$current_hash" = "$stored_hash" ]; then
            # echo "Skipping ${key}: file unchanged"
            need_processing=false
          fi
        fi

        if [ "$need_processing" = true ]; then
          # Run bedLike.ts to process the SQL file
          result=$(node src/bedLike.ts "${infile}.sql" 2>&1)
          header=$(echo "$result" | grep -v "^no_bin$")

          # Check if stderr contains "no_bin"
          if echo "$result" | grep -q "no_bin"; then
            (echo "$header" && pigz -dc "${infile}.txt.gz") >"${outfile}.tmp"
          else
            (echo "$header" && pigz -dc "${infile}.txt.gz" | hck -Ld$'\t' -f2-) >"${outfile}.tmp"
          fi
          ./sortIfNeeded.sh "${outfile}.tmp" | bgzip -@8 >"${outfile}.bed.gz"
          tabix -p bed -C ${outfile}.bed.gz
          # Store the hash for future comparisons
          echo "$current_hash" >"$hash_file"
          rm -f "${outfile}.tmp"
        fi
      fi
    done
  fi
}

export -f process_assembly
export OUT

# Run the process_assembly function in parallel for each input directory
parallel --bar --will-cite process_assembly ::: "$@"
