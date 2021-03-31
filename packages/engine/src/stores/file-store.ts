import {
  writeFile as writeFileRaw,
  readFile as readFileRaw,
  mkdir as mkdirRaw,
  readdir as readdirRaw,
} from 'fs'
import { join } from 'path'
import { promisify } from 'util'

import { Chapter } from '@dungeon-notes/types'
import {
  convertChapterToMarkdown,
  convertMarkdownToChapter,
} from '../utils/convertor'

const writeFile = promisify(writeFileRaw)
const readFile = promisify(readFileRaw)
const mkdir = promisify(mkdirRaw)
const readdir = promisify(readdirRaw)

export default class FileStore {
  private basePath: string

  constructor(basePath: string) {
    this.basePath = basePath
  }

  async writeChapter(index: number, chapter: Chapter): Promise<void> {
    const chapterDirectoryName = `${index}-${chapter.slug}`

    await mkdir(join(this.basePath, 'chapters', chapterDirectoryName), {
      recursive: true,
    })

    const markdown = await convertChapterToMarkdown(chapter)

    await writeFile(
      join(this.basePath, 'chapters', chapterDirectoryName, 'chapter.md'),
      markdown,
    )
  }

  async readAllChapters(): Promise<Array<Chapter>> {
    try {
      const entries = await readdir(join(this.basePath, 'chapters'), {
        withFileTypes: true,
      })

      const chapterDirectories = entries.filter((entry) => entry.isDirectory())
      const chapters = []
      for (const chapterDirectory of chapterDirectories) {
        // eslint-disable-next-line no-await-in-loop
        const infoFile = await readFile(
          join(this.basePath, 'chapters', chapterDirectory.name, 'chapter.md'),
        )

        // eslint-disable-next-line no-await-in-loop
        const adventure = await convertMarkdownToChapter(infoFile.toString())

        chapters.push(adventure)
      }

      return chapters
    } catch (error) {
      if (error.code === 'ENOENT') {
        return []
      }

      throw error
    }
  }
}
