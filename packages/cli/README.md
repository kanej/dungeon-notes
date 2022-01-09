# Dungeon Notes Writer

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dnwriter.svg)](https://npmjs.org/package/dnwriter)
[![Downloads/week](https://img.shields.io/npm/dw/dnwriter.svg)](https://npmjs.org/package/dnwriter)
[![License](https://img.shields.io/npm/l/dnwriter.svg)](https://github.com/kanej/dungeon-notes/blob/master/package.json)

> Write D & D 5e adventures in markdown

The dungeon notes writer is a cli tool that supports
writing D & D 5e adventures in markdown by providing
a local web-based editor for authoring the adventure,
saving as markdown files in a local directory and
generating html from saved files.

<!-- toc -->

- [Dungeon Notes Writer](#dungeon-notes-writer)
- [Usage](#usage)
- [Commands](#commands)
- [Development](#development)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @dungeon-notes/cli
$ dnwriter COMMAND
running command...
$ dnwriter (-v|--version|version)
@dungeon-notes/cli/0.4.0 darwin-x64 node-v14.18.1
$ dnwriter --help [COMMAND]
USAGE
  $ dnwriter COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`dnwriter help [COMMAND]`](#dnwriter-help-command)
- [`dnwriter summon [TYPE]`](#dnwriter-summon-type)

## `dnwriter help [COMMAND]`

display help for dnwriter

```
USAGE
  $ dnwriter help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.3.1/src/commands/help.ts)_

## `dnwriter summon [TYPE]`

randomly generate a name

```
USAGE
  $ dnwriter summon [TYPE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [lib/commands/summon.js](https://github.com/kanej/dungeon-notes/blob/v0.4.0/lib/commands/summon.js)_

<!-- commandsstop -->

# Development

The graphql server provided by the `serve` command can be run under nodemon with:

```shell
yarn dev
```
