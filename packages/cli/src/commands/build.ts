import fs from 'fs'
import path from 'path'
import { Engine } from '@dungeon-notes/engine'
import { Adventure, Chapter } from '@dungeon-notes/types'
import { Command, flags } from '@oclif/command'
import chalk from 'chalk'
import cli from 'cli-ux'
import handlebars from 'handlebars'
import convertMarkdownToHtml from '../utils/convert-markdown-to-html'

// eslint-disable-next-line import/no-unused-modules
export default class Build extends Command {
  static description = 'build a static site from the repo'

  static flags = {
    help: flags.help({ char: 'h' }),
    path: flags.string({ char: 'p', default: '.' }),
  }

  static args = [{ name: 'file' }]

  async run(): Promise<void> {
    const { flags } = this.parse(Build)
    const outputDirectoryPath = './site'

    const engine = new Engine(flags.path)

    const { success, error } = await engine.init()

    if (!success) {
      throw new Error(error)
    }

    const outputChaptersDirectoryPath = path.join(
      outputDirectoryPath,
      'chapters',
    )
    const indexFilePath = path.join(outputDirectoryPath, 'index.html')

    try {
      const adventure = await engine.getAdventure()
      const chapters = await engine.getChapters()

      const { name } = adventure

      this.log('')
      this.log(`Building website for the adventure ${chalk.bold(name)}`)
      this.log('')
      cli.action.start(`Creating ${outputDirectoryPath} directory`)

      if (!fs.existsSync(outputDirectoryPath)) {
        await fs.promises.mkdir(outputDirectoryPath)
      }

      if (!fs.existsSync(outputChaptersDirectoryPath)) {
        await fs.promises.mkdir(outputChaptersDirectoryPath)
      }

      cli.action.stop()

      cli.action.start('Creating index.html from adventure')

      const indexContent = await this._generateIndexFrom(adventure, chapters)
      await fs.promises.writeFile(indexFilePath, indexContent)

      cli.action.stop()
    } catch (error) {
      this.log(chalk.red(`${chalk.bold('Error:')} ${error}`))
      this.exit(1)
    }
  }

  private async _generateIndexFrom(adventure: Adventure, chapters: Chapter[]) {
    const indexTemplateText = await fs.promises.readFile(
      path.resolve(__dirname, '../templates/index.handlebars'),
    )

    const template = handlebars.compile(indexTemplateText.toString())

    const descriptionHtml = await convertMarkdownToHtml(adventure.description)

    return template({
      ...adventure,
      chapters: chapters,
      description: descriptionHtml,
    })
  }
}
