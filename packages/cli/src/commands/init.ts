import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'

export default class Init extends Command {
  static description = 'Setup a new notes repo'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [{ name: 'file' }]

  async run() {
    // const { args, flags } = this.parse(Init)

    const campaign = await cli.prompt('What is the campaign called?')
    this.log(campaign)
  }
}
