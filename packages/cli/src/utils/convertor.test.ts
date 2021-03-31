import { Chapter, toGuid } from '@dungeon-notes/types'
import { convertChapterToMarkdown, convertMarkdownToChapter } from './convertor'

const exampleAdventure: Chapter = {
  id: toGuid('7ada3478-30e1-4663-8de3-39ea5b70f885'),
  name: 'In the Tavern',
  slug: 'in-the-tavern',
  body: '## The pub\n\nWelcome.',
}

const exampleAdventureMarkdown = `---
id: 7ada3478-30e1-4663-8de3-39ea5b70f885
name: In the Tavern
---

## The pub

Welcome.
`

describe('convertor', () => {
  describe('Adventure', () => {
    it('should serialize to markdown with frontmatter', async () => {
      const markdown = await convertChapterToMarkdown(exampleAdventure)

      expect(markdown).toBe(exampleAdventureMarkdown)
    })

    it('should deserialize to adventure', async () => {
      const adventure = await convertMarkdownToChapter(exampleAdventureMarkdown)

      expect(adventure).toStrictEqual(exampleAdventure)
    })
  })
})
