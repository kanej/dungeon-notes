import fs from 'fs'
import { Engine, actions } from '@dungeon-notes/engine'
import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'

const { setup } = actions

// eslint-disable-next-line import/no-unused-modules
export default class Init extends Command {
  static description = 'Setup a new notes repo'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [{ name: 'path' }]

  async run(): Promise<void> {
    const { args } = this.parse(Init)

    try {
      await fs.promises.access('./adventure.md', fs.constants.F_OK)
      this.log('adventure.md file already exists')
      this.exit(1)
    } catch {
      this.debug('adventure.md file not found')
    }

    const adventureName = await cli.prompt('What is the adventure called?')

    cli.action.start(`Setting up ${chalk.italic(adventureName)} campaign ...`)

    const engine = new Engine(args.path)

    const { success, error } = await engine.init()

    if (!success) {
      this.log(`${chalk.red('Error:')} ${error}`)
      this.exit(1)
    }

    await engine.apply(setup({ name: adventureName }))

    cli.action.stop()
  }
}
