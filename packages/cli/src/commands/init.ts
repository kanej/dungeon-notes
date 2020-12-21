import { Command, flags } from '@oclif/command'
import cli from 'cli-ux'
import fs from 'fs'

export default class Init extends Command {
  static description = 'Setup a new notes repo'

  static flags = {
    help: flags.help({ char: 'h' }),
  }

  static args = [{ name: 'file' }]

  async run() {
    try {
      await fs.promises.access('./campaign.json', fs.constants.F_OK)
      this.log('campaign.json file already exists')
      this.exit(1)
    } catch (err) {
      // continue
    }

    const campaign = await cli.prompt('What is the campaign called?')

    cli.action.start(`Setting up ${campaign} campaign ...`)

    fs.writeFileSync(
      './campaign.json',
      JSON.stringify({ name: campaign, version: '0.1' }, null, 2),
    )
    fs.mkdirSync('./scenes')

    cli.action.stop()
  }
}
