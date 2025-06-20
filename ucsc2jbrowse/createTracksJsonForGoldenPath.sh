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

  ## make tracks.json file
  if [[ -f $DB/trackDb.sql ]]; then
    node src/tracksDbLike.ts $DB/trackDb.sql $DB/trackDb.txt.gz >$OUTDIR/tracks.json

    # find bigbed files in the tracks.json, these do not have sql db files
    node src/parseBigFileTracks.ts $OUTDIR/tracks.json $DB $OUTDIR >$OUTDIR/bigTracks.json
    node src/addBigDataTracks.ts $OUTDIR/bigTracks.json $OUTDIR/config.json
  fi
}

export -f process_assembly
export OUT

parallel --bar --will-cite process_assembly ::: "$@"
