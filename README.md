# jb2hubs

This is a portal that creates JBrowse 2 links to UCSC track hubs

https://jbrowse.org/jb2hubs

## Pre-requisites

- Custom fork of bed2gff https://github.com/cmdcolin/bed2gff/ (clone, cargo
  build, copy to ~/bed2gff)
- hck
- fdfind aka fd
- node.js, yarn, and npm install -g @jbrowse/cli
- rclone

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

## Note

This repo was written with the aid of AI tools including Claude and avante.nvim

A huge thank you to UCSC team for their generous data sharing policy and work on
these resources
