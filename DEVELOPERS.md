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
