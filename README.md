# Table of Contents <!-- omit from toc -->

- [Setup](#setup)
  - [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
  - [How to use](#how-to-use)
  - [Imports](#imports)
    - [Examples:](#examples)
  - [Debugging](#debugging)
- [Recommended aliases](#recommended-aliases)

# Setup

If you wish to start from scratch you can do so by using the [official template](https://github.com/bitburner-official/typescript-template) for synchronizing Typescript/Javascript from your computer to the game.
This kit is directly using the template, just adds some default scripts and changes some settings on the [filesync.json](./filesync.json) file

[Step by step install](./BeginnersGuide.md#step-by-step-guide-to-setting-up-the-typescript-template-from-scratch)

[Learn more about Typescript](https://www.typescriptlang.org/docs/)

## Prerequisites

[Node.js](https://nodejs.org/en/download/) is needed for compiling typescript and installing dependencies

# Quick start

Download the repo to your computer and install the dependencies:

```
git clone https://github.com/carlos-err406/bitburner-kit
cd bitburner-kit
npm install
```

## How to use

Write all your typescript source code in the `/src` directory

To autocompile and send changed files as you save, run `npm run watch` in a terminal.
Have it running in the background so that it all happens automatically.

For Bitburner to receive any files, you need to follow these steps:

1. Make sure you have the server running (`npm run watch`)
2. In the game, go to `Options` > `Remote API`
3. Enter the `port` specified in th [filesync.json](./filesync.json) file (defaults to `12525`)
4. Click `Connect`, there should be a toast notification indicating that the connection has been established

## Imports

To ensure both the game and typescript have no issues with import paths, your import statements should follow a few formatting rules:

- Paths must be absolute from the root of `src/`, which will be equivalent to the root directory of your home drive
- Paths must contain no leading slash
- Paths must end with no file extension

### Examples:

To import `helperFunction` from the file `helpers.ts` located in the directory `src/lib/`:

```js
import { helperFunction } from "lib/helpers";
```

To import all functions from the file `helpers.ts` located in the `src/lib/` directory as the namespace `helpers`:

```js
import * as helpers from "lib/helpers";
```

To import `someFunction` from the file `main.ts` located in the `src/` directory:

```js
import { someFunction } from "main";
```

## Debugging

For debugging bitburner on Steam you will need to enable a remote debugging port. This can be done by rightclicking bitburner in your Steam library and selecting properties. There you need to add `--remote-debugging-port=9222` [Thanks @DarkMio]

# Recommended aliases

```
alias bp=connect backgroundprocess
alias con=connect
alias sa=scan-analyze
alias profile=run /scripts/lib/profiler.js
alias nuke=run Nuke.exe
alias upgrade=run /scripts/lib/upgrade-server.js
alias list=run /scripts/lib/list-server.js
alias rename=run /scripts/lib/rename-server.js
alias path=run /scripts/lib/path-to.js
alias config=nano /scripts/config/config.js
alias purchase=run /scripts/lib/buy-server.js
alias l=ls -l
alias refresh=run /scripts/init.js
```
