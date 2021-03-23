import fs from 'fs'
import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'
import { AdventureInfo } from '../domain'

// eslint-disable-next-line import/no-unused-modules
export default class Init extends Command {
  static description = 'Setup a new notes repo'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [{ name: 'file' }]

  async run(): Promise<void> {
    try {
      await fs.promises.access('./adventure.json', fs.constants.F_OK)
      this.log('adventure.json file already exists')
      this.exit(1)
    } catch {
      this.debug('adventure.json file not found')
    }

    const adventureName = await cli.prompt('What is the adventure called?')

    cli.action.start(`Setting up ${adventureName} campaign ...`)

    const adventure: AdventureInfo = {
      name: adventureName,
      version: '0.1',
      edition: 5,
      levels: '1-5',
      description: '',
    }

    fs.writeFileSync(
      './adventure.json',
      JSON.stringify(adventure, undefined, 2),
    )

    fs.mkdirSync('./chapters')

    cli.action.stop()
  }
}
