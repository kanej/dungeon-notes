import {
  writeFile as writeFileRaw,
  readFile as readFileRaw,
  mkdir as mkdirRaw,
  readdir as readdirRaw,
  rename as renameRaw,
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
const rename = promisify(renameRaw)

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

  async renameChapter(
    index: number,
    previous: Chapter,
    current: Chapter,
  ): Promise<void> {
    const from = `${index}-${previous.slug}`
    const to = `${index}-${current.slug}`

    const markdown = await convertChapterToMarkdown(current)

    console.log(
      `renaming ${join(this.basePath, 'chapters', from)} to ${join(
        this.basePath,
        'chapters',
        to,
      )}`,
    )

    await rename(
      join(this.basePath, 'chapters', from),
      join(this.basePath, 'chapters', to),
    )
    await writeFile(join(this.basePath, 'chapters', to, 'chapter.md'), markdown)
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

      console.error(error)
      throw error
    }
  }
}
