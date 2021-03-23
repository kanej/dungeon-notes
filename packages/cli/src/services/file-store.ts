import fs from 'fs'
import path from 'path'
import { promisify } from 'util'

import { Chapter } from '@dungeon-notes/types'
import {
  convertChapterToMarkdown,
  convertMarkdownToChapter,
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

  async writeChapter(chapter: Chapter): Promise<void> {
    await mkdir(path.join(this.basePath, 'chapters', chapter.slug), {
      recursive: true,
    })

    const markdown = await convertChapterToMarkdown(chapter)

    await writeFile(
      path.join(this.basePath, 'chapters', chapter.slug, 'intro.md'),
      markdown,
    )
  }

  async readAllChapters(): Promise<Array<Chapter>> {
    const entries = await readdir(path.join(this.basePath, 'chapters'), {
      withFileTypes: true,
    })

    const chapterDirectories = entries.filter((entry) => entry.isDirectory())
    const chapters = []
    for (const chapterDirectory of chapterDirectories) {
      // eslint-disable-next-line no-await-in-loop
      const infoFile = await readFile(
        path.join(this.basePath, 'chapters', chapterDirectory.name, 'intro.md'),
      )

      // eslint-disable-next-line no-await-in-loop
      const adventure = await convertMarkdownToChapter(infoFile.toString())

      chapters.push(adventure)
    }

    return chapters
  }
}
