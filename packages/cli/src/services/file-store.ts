import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import { Adventure } from '../domain'
import {
  convertAdventureToMarkdown,
  convertMarkdownToAdventure,
} from '../utils/convertor'

const writeFile = promisify(fs.writeFile)
const readFile = promisify(fs.readFile)
const mkdir = promisify(fs.mkdir)
const readdir = promisify(fs.readdir)

export default class FileStore {
  private basePath: string

  constructor(basePath: string) {
    this.basePath = basePath
  }

  async writeAdventure(adventure: Adventure): Promise<void> {
    // write to file
    await mkdir(path.join(this.basePath, 'adventures', adventure.slug), {
      recursive: true,
    })

    const markdown = await convertAdventureToMarkdown(adventure)

    await writeFile(
      path.join(this.basePath, 'adventures', adventure.slug, 'intro.md'),
      markdown,
    )
  }

  async readAllAdventures(): Promise<Array<Adventure>> {
    const entries = await readdir(path.join(this.basePath, 'adventures'), {
      withFileTypes: true,
    })

    const adventureDirectories = entries.filter((entry) => entry.isDirectory())
    const adventures = []
    for (const adventureDirectory of adventureDirectories) {
      // eslint-disable-next-line no-await-in-loop
      const infoFile = await readFile(
        path.join(
          this.basePath,
          'adventures',
          adventureDirectory.name,
          'intro.md',
        ),
      )

      // eslint-disable-next-line no-await-in-loop
      const adventure = await convertMarkdownToAdventure(infoFile.toString())

      adventures.push(adventure)
    }

    return adventures
  }
}
