import {
  convertAdventureToMarkdown,
  convertMarkdownToAdventure,
} from './convertor'

const exampleAdventure = {
  name: 'In the Tavern',
  slug: 'in-the-tavern',
  description: 'The adventurers start in the pub',
  body: '## The pub\n\nWelcome.',
}

const exampleAdventureMarkdown = `---
name: In the Tavern
description: The adventurers start in the pub
---

## The pub

Welcome.
`

describe('convertor', () => {
  describe('Adventure', () => {
    it('should serialize to markdown with frontmatter', async () => {
      const markdown = await convertAdventureToMarkdown(exampleAdventure)

      expect(markdown).toBe(exampleAdventureMarkdown)
    })

    it('should deserialize to adventure', async () => {
      const adventure = await convertMarkdownToAdventure(
        exampleAdventureMarkdown,
      )

      expect(adventure).toStrictEqual(exampleAdventure)
    })
  })
})
