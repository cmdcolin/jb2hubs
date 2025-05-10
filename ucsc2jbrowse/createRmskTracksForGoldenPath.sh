#!/bin/bash
export LC_ALL=C
export NODE_OPTIONS="--no-warnings=ExperimentalWarning"

# Set default value for OUT if not already set
: ${OUT:=~/ucscResults}

# Function to process a single rmsk
process_rmsk() {
  local INDIR=$1
  local ASM=$(basename $INDIR)
  local OUTDIR=$OUT/$ASM
  local DB=$INDIR/$ASM/database

  mkdir -p $OUTDIR

  if [ -f "$OUTDIR/tracks.json" ]; then
    keys=$(jq -r 'to_entries | .[] | select(.value.type | startswith("rmsk")) | .key' "$OUTDIR/tracks.json")

    for key in $keys; do
      infile="$DB/$key"
      outfile="$OUTDIR/$key"

      if [ -f "${infile}.sql" ]; then

        # Create hash file path
        hash_file="${outfile}.hash"

        # Calculate current hash of the input file
        current_hash=$(xxh128sum "${infile}.txt.gz" | awk '{print $1}')

        # Check if we need to process the file
        need_processing=true
        if [ -f "${outfile}.bed.gz" ] && [ -f "$hash_file" ]; then
          stored_hash=$(cat "$hash_file")
          if [ "$current_hash" = "$stored_hash" ]; then
            # echo "Skipping ${key}: file unchanged"
            need_processing=false
          fi
        fi

        if [ "$need_processing" = true ]; then
          node src/rmskLike.ts "${infile}.sql" "${infile}.txt.gz" >${outfile}.tmp
          sortIfNeeded.sh ${outfile}.tmp | bgzip -@8 >"${outfile}.bed.gz"
          tabix -p bed -C "${outfile}.bed.gz"
          rm -f ${outfile}.tmp
          # Store the hash for future comparisons
          echo "$current_hash" >"$hash_file"
        fi
      fi
    done

  fi
}

export -f process_rmsk
export OUT

echo "createRmskTracksForGoldenPath"
parallel --bar --will-cite process_rmsk ::: "$@"
