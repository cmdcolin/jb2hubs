aws s3 sync --delete --exclude="*meta.json" --exclude "*.hash" ~/ucscResults s3://jbrowse.org/ucsc/

aws cloudfront create-invalidation --distribution-id E13LGELJOT4GQO --paths "/ucsc/*"
