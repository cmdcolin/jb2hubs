# jb2hubs

This is a portal that creates JBrowse 2 links to UCSC track hubs

https://cmdcolin.github.io/jb2hubs

## Preparing GenArk hubs

```bash
cd genark2jbrowse
yarn
./makeAll.sh
```

## Preparing UCSC hubs

```bash
cd ucsc2jbrowse
yarn
./makeAll.sh
```

## Deploy website

```bash
cd website
yarn
yarn deploy
```

## Note

This repo was written with the aid of Claude and avante.nvim

Big thank you as well to UCSC team for their data sharing and more!
