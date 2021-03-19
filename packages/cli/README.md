# Dungeon Notes Writer

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dmnotes.svg)](https://npmjs.org/package/dmnotes)
[![Downloads/week](https://img.shields.io/npm/dw/dmnotes.svg)](https://npmjs.org/package/dmnotes)
[![License](https://img.shields.io/npm/l/dmnotes.svg)](https://github.com/kanej/dmnotes/blob/master/package.json)

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
$ npm install -g @dungeon-notes/writer
$ dnwriter COMMAND
running command...
$ dnwriter (-v|--version|version)
@dungeon-notes/writer/0.0.2 darwin-x64 node-v14.15.3
$ dnwriter --help [COMMAND]
USAGE
  $ dnwriter COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`dnwriter build [FILE]`](#dnwriter-build-file)
- [`dnwriter help [COMMAND]`](#dnwriter-help-command)
- [`dnwriter init [FILE]`](#dnwriter-init-file)
- [`dnwriter serve [FILE]`](#dnwriter-serve-file)

## `dnwriter build [FILE]`

build a static site from the repo

```
USAGE
  $ dnwriter build [FILE]

OPTIONS
  -h, --help       show CLI help
  -p, --path=path  [default: .]
```

_See code: [src/commands/build.ts](https://github.com/kanej/dungeon-notes/blob/v0.0.2/src/commands/build.ts)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `dnwriter init [FILE]`

Setup a new notes repo

```
USAGE
  $ dnwriter init [FILE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/init.ts](https://github.com/kanej/dungeon-notes/blob/v0.0.2/src/commands/init.ts)_

## `dnwriter serve [FILE]`

serves the notes

```
USAGE
  $ dnwriter serve [FILE]

OPTIONS
  -h, --help       show CLI help
  -p, --port=port  [default: 9898] the port to serve on

EXAMPLE
  $ dmnotes serve
```

_See code: [src/commands/serve.ts](https://github.com/kanej/dungeon-notes/blob/v0.0.2/src/commands/serve.ts)_

<!-- commandsstop -->

# Development

The graphql server provided by the `serve` command can be run under nodemon with:

```shell
yarn dev
```
