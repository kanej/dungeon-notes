# dmnotes

Run a server that hosts your DM notes

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/dmnotes.svg)](https://npmjs.org/package/dmnotes)
[![Downloads/week](https://img.shields.io/npm/dw/dmnotes.svg)](https://npmjs.org/package/dmnotes)
[![License](https://img.shields.io/npm/l/dmnotes.svg)](https://github.com/kanej/dmnotes/blob/master/package.json)

<!-- toc -->

- [dmnotes](#dmnotes)
- [Usage](#usage)
- [Commands](#commands)
- [Development](#development)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @dungeon-notes/writer
$ dmnotes COMMAND
running command...
$ dmnotes (-v|--version|version)
@dungeon-notes/writer/0.1.8 darwin-x64 node-v14.15.3
$ dmnotes --help [COMMAND]
USAGE
  $ dmnotes COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`dmnotes build [FILE]`](#dmnotes-build-file)
- [`dmnotes help [COMMAND]`](#dmnotes-help-command)
- [`dmnotes init [FILE]`](#dmnotes-init-file)
- [`dmnotes serve [FILE]`](#dmnotes-serve-file)

## `dmnotes build [FILE]`

build a static site from the repo

```
USAGE
  $ dmnotes build [FILE]

OPTIONS
  -h, --help       show CLI help
  -p, --path=path  [default: .]
```

_See code: [src/commands/build.ts](https://github.com/kanej/dungeon-notes/blob/v0.1.8/src/commands/build.ts)_

## `dmnotes help [COMMAND]`

display help for dmnotes

```
USAGE
  $ dmnotes help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `dmnotes init [FILE]`

Setup a new notes repo

```
USAGE
  $ dmnotes init [FILE]

OPTIONS
  -h, --help  show CLI help
```

_See code: [src/commands/init.ts](https://github.com/kanej/dungeon-notes/blob/v0.1.8/src/commands/init.ts)_

## `dmnotes serve [FILE]`

serves the notes

```
USAGE
  $ dmnotes serve [FILE]

OPTIONS
  -h, --help       show CLI help
  -p, --port=port  [default: 9898] the port to serve on

EXAMPLE
  $ dmnotes serve
```

_See code: [src/commands/serve.ts](https://github.com/kanej/dungeon-notes/blob/v0.1.8/src/commands/serve.ts)_

<!-- commandsstop -->

# Development

The graphql server provided by the `serve` command can be run under nodemon with:

```shell
yarn dev
```
