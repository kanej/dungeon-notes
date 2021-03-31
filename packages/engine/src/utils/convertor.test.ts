import { Chapter, toGuid } from '@dungeon-notes/types'
import { convertChapterToMarkdown, convertMarkdownToChapter } from './convertor'

const exampleChapter: Chapter = {
  id: toGuid('c815311e-93ec-43a5-af1e-d55306b83124'),
  name: 'In the Tavern',
  slug: 'in-the-tavern',
  body: '## The pub\n\nWelcome.',
}

const exampleChapterMarkdown = `---
id: c815311e-93ec-43a5-af1e-d55306b83124
name: In the Tavern
---

## The pub

Welcome.
`

describe('convertor', () => {
  describe('Adventure', () => {
    it('should serialize to markdown with frontmatter', async () => {
      const markdown = await convertChapterToMarkdown(exampleChapter)

      expect(markdown).toBe(exampleChapterMarkdown)
    })

    it('should deserialize to adventure', async () => {
      const adventure = await convertMarkdownToChapter(exampleChapterMarkdown)

      expect(adventure).toStrictEqual(exampleChapter)
    })
  })
})
