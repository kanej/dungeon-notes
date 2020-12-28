import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import { Adventure } from '../domain'
import { convertAdventureToMarkdown } from '../utils/convertor'

const writeFile = promisify(fs.writeFile)
const mkdir = promisify(fs.mkdir)

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
}
