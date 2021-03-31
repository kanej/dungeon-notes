import { Chapter, ChapterDescriptor, toGuid } from '@dungeon-notes/types'
import { v4 as uuidV4 } from 'uuid'
import toSlug from '../utils/to-slug'
import FileStore from './file-store'

export default class ChapterService {
  private fileStore: FileStore

  private chapters: { [key: string]: Chapter }

  constructor(fileStore: FileStore, chapters: { [key: string]: Chapter }) {
    this.fileStore = fileStore
    this.chapters = chapters
  }

  async add(name: string): Promise<ChapterDescriptor> {
    const chapter: Chapter = {
      id: toGuid(uuidV4()),
      name,
      slug: toSlug(name),
      body: 'Start your chapter ...',
    }

    this.chapters[chapter.slug] = chapter

    await this.fileStore.writeChapter(chapter)

    return {
      name,
      slug: chapter.slug,
    }
  }

  async updateBody(slug: string, body: string): Promise<boolean> {
    const chapter = this.chapters[slug]
    chapter.body = body

    await this.fileStore.writeChapter(chapter)

    return true
  }

  async load(): Promise<void> {
    const chaptersFromStore = await this.fileStore.readAllChapters()
    this.chapters = Object.fromEntries(
      chaptersFromStore.map((a) => [a.slug, a]),
    )
  }

  listNames(): Array<ChapterDescriptor> {
    return Object.values(this.chapters).map(({ slug, name }) => ({
      slug,
      name,
    }))
  }

  get(slug: string): Chapter {
    return this.chapters[slug]
  }
}
