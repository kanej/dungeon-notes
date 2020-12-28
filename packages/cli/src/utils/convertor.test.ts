import { Adventure } from '../domain'
import { convertAdventureToMarkdown } from './convertor'

describe('convertor', () => {
  describe('Adventure', () => {
    it('should serialize to markdown with frontmatter', async () => {
      const adventure: Adventure = {
        name: 'In the Tavern',
        slug: 'in-the-tavern',
        description: 'The adventurers start in the pub',
        body: '## The pub\n\nWelcome.',
      }

      const markdown = await convertAdventureToMarkdown(adventure)

      expect(markdown).toBe('example - adventure: In the Tavern')
    })
  })
})
