#!/bin/bash

ls gff/*.gz | parallel --bar -j8 'filename=$(basename {}); \
  zcat {} | awk -F"\t" "BEGIN{OFS=\"\t\"} {if (\$4 >= \$5 && \$4 != \".\" && \$5 != \".\") {temp=\$4; \$4=\$5; \$5=temp} print}" > {.}; \
  jbrowse sort-gff {.} | bgzip -@8 >bgz/$filename; \
  tabix -C bgz/$filename; \
  rm {.}'
