import fs from 'fs'
import { Engine, actions } from '@dungeon-notes/engine'
import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import { generate } from '@dungeon-notes/name-generator'

const { setup } = actions

// eslint-disable-next-line import/no-unused-modules
export default class Summon extends Command {
  static description = 'randomly generate a name'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [{ name: 'type', default: 'name', options: ['name'] }]

  async run(): Promise<void> {
    const { args } = this.parse(Summon)

    const type: 'name' = args.type

    switch (type) {
      case 'name':
        return this.summonName()
      default:
        throw new Error('Unrecognised type')
    }
  }

  async summonName() {
    const name = generate()

    this.log('\n' + chalk.bold(name))
  }
}
