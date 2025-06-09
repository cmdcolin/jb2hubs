#!/bin/bash

# Set up error handling
set -e

echo "Fetching list of studies..."
# Fetch all studies and store the response
studies_response=$(curl -s "https://www.ebi.ac.uk/eva/webservices/rest/v1/meta/studies/all")

# Extract study IDs using jq
# The response has a structure {response:[{result:[{id:string}]}]}
study_ids=$(echo "$studies_response" | jq -r '.response[0].result[].id')

# Count the number of studies
total_studies=$(echo "$study_ids" | wc -l)
echo "Found $total_studies studies. Fetching summaries..."
echo $study_ids

# Create a directory for the output if it doesn't exist
mkdir -p study_summaries

# Initialize counter
count=0

# Loop through each study ID
for id in $study_ids; do
  echo "Getting info for: " $id

  # Fetch the study summary
  curl -s "https://www.ebi.ac.uk/eva/webservices/rest/v1/studies/$id/summary" >"study_summaries/$id.json"
  # https://www.ebi.ac.uk/eva/webservices/rest/v1/studies/PRJEB4019/summary

  # Add a small delay to avoid overwhelming the server
  sleep 1
done

echo "All study summaries have been downloaded to the 'study_summaries' directory."
