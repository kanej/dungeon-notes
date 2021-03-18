import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'
import { Adventure } from '../domain'
import convertMarkdownToHtml from '../utils/convert-markdown-to-html'

export default class Build extends Command {
  static description = 'build a static site from the repo'

  static flags = {
    help: flags.help({ char: 'h' }),
    path: flags.string({ char: 'p', default: '.' }),
  }

  static args = [{ name: 'file' }]

  async run(): Promise<void> {
    const { flags } = this.parse(Build)

    const adventureFilePath = path.join(flags.path, './adventure.json')
    const outputDirPath = './site'
    const outputChaptersDirPath = path.join(outputDirPath, 'chapters')
    const indexFilePath = path.join(outputDirPath, 'index.html')

    try {
      try {
        await fs.promises.access(adventureFilePath, fs.constants.F_OK)
      } catch (error) {
        this.log(chalk.red(`${chalk.bold('Error:')} ${error}`))
        this.exit(1)
      }

      const adventureText = await fs.promises.readFile(adventureFilePath)
      const adventure = JSON.parse(adventureText.toString())

      const { name } = adventure

      this.log('')
      this.log(`Building website for the adventure ${chalk.bold(name)}`)
      this.log('')
      cli.action.start(`Creating ${outputDirPath} directory`)

      if (!fs.existsSync(outputDirPath)) {
        await fs.promises.mkdir(outputDirPath)
      }

      if (!fs.existsSync(outputChaptersDirPath)) {
        await fs.promises.mkdir(outputChaptersDirPath)
      }

      cli.action.stop()

      cli.action.start('Creating index.html from adventure')

      const indexContent = await this._generateIndexFrom(adventure)
      await fs.promises.writeFile(indexFilePath, indexContent)

      cli.action.stop()
    } catch (error) {
      this.log(chalk.red(`${chalk.bold('Error:')} ${error}`))
      this.exit(1)
    }
  }

  private async _generateIndexFrom(adventure: Adventure) {
    const indexTemplateText = await fs.promises.readFile(
      path.resolve(__dirname, '../templates/index.handlebars'),
    )
    const template = handlebars.compile(indexTemplateText.toString())

    const descriptionHtml = await convertMarkdownToHtml(adventure.description)

    return template({ ...adventure, description: descriptionHtml })
  }
}
