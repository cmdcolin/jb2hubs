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
        node src/rmskLike.ts "${infile}.sql" "${infile}.txt.gz" >${outfile}.tmp
        sortIfNeeded.sh ${outfile}.tmp | bgzip -@8 >"${outfile}.bed.gz"
        rm ${outfile}.tmp
      fi
    done

  fi
}

export -f process_rmsk
export OUT

echo "createRmskTracksForGoldenPath"
parallel --bar --will-cite process_rmsk ::: "$@"
