## Pre-requisites

- Custom fork of bed2gff https://github.com/cmdcolin/bed2gff/ (clone, cargo
  build, copy to ~/bed2gff)
- hck
- fdfind aka fd
- node.js, yarn, and npm install -g @jbrowse/cli
- rclone
- ncbi "datasets" cli

## Do everything

Run ./run.sh in root of repo

It will update and deploy genark2jbrowse, ucsc2jbrowse, and website

## Preparing GenArk hubs

```bash
cd genark2jbrowse
yarn
./makeAll.sh
# optionally review git diff
./uploadAll.sh
```

## Preparing UCSC hubs

```bash
cd ucsc2jbrowse
yarn
./doAll.sh
# optionally review git diff
./uploadAll.sh
```

## Deploy website

```bash
cd website
yarn
yarn deploy
```

## Why Astro

We started with Next.js, but it was slow and did not have reproducible builds,
making bulk export to AWS S3 slow and even costly (uploading thousands of files)

## What is in this repo

- Scripts that ingest the UCSC goldenPath database dumps, and converts them into
  jbrowse configs (the ucsc2jbrowse folder)
- Scripts that convert the UCSC GenArk hubs, and converts them into jbrowse
  configs (the genark2jbrowse folder)
- Astro-based website for statically generating lots of pages (the website
  folder)

## Note

This repo was written with the aid of AI tools including Claude and avante.nvim

A huge thank you to UCSC team for their generous data sharing policy and work on
these resources

## Rclone config

This is in ~/.config/rclone/rclone.conf

```
[jbrowse-data]
type = s3
provider = AWS
env_auth = true
region = us-east-1
acl = public-read
storage_class = STANDARD_IA

[jbrowse-data-hashed]
type = hasher
remote = jbrowse-data:
```
