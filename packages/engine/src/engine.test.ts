import { readFileSync } from 'fs'
import { join } from 'path'
import {
  addChapter,
  AdventureInfo,
  toGuid,
  updateAdventureDescription,
  updateAdventureLevels,
  updateAdventureName,
} from '@dungeon-notes/types'
import mock from 'mock-fs'
import Engine from './engine'
import { RepoState, setup } from './redux/slices/repoSlice'

const exampleAdventure: AdventureInfo = {
  name: 'Challenge in Green',
  version: '0.1',
  edition: 5,
  levels: '2-9',
  description: 'The one with the green knight',
}

function space(strings: TemplateStringsArray) {
  const lines = strings[0].split('\n')

  return `${lines
    .slice(1)
    .map((l) => l.trim())
    .join('\n')}\n`
}

const expectAdventureStateAndFileToBe = (
  engine: Engine,
  directory: string,
  expectedAdventure: AdventureInfo,
  expectedChapters: Array<string> = [],
) => {
  expect(engine.getState()).toBe(RepoState.VALID)

  const adventureFileText = readFileSync(join(directory, 'adventure.json'))

  expect(JSON.parse(adventureFileText.toString())).toStrictEqual(
    expectedAdventure,
  )

  expect(engine.getAdventure()).toStrictEqual({
    ...expectedAdventure,
    chapters: expectedChapters,
  })
}

describe('Engine', () => {
  const emptyDirectory = 'test/empty'
  const basicAdventureDirectory = 'test/basic'
  const noneJsonAdventureFile = 'test/nonjson'
  const adventureWithChapters = 'test/withchapters'

  describe('state', () => {
    beforeEach(() => {
      mock({
        [emptyDirectory]: {},
        [basicAdventureDirectory]: {
          'adventure.json': JSON.stringify(exampleAdventure),
        },
        [noneJsonAdventureFile]: {
          'adventure.json': 'not really json',
        },
      })
    })

    afterEach(() => {
      mock.restore()
    })

    it('should be valid on loading a populated adventure repo', async () => {
      const engine = new Engine(basicAdventureDirectory)

      const { success } = await engine.init()

      expect(success).toBe(true)

      expect(engine.getState()).toBe(RepoState.VALID)
      expect(engine.getAdventure()).toStrictEqual({
        name: 'Challenge in Green',
        version: '0.1',
        edition: 5,
        levels: '2-9',
        description: 'The one with the green knight',
        chapters: [],
      })
    })

    it('should be uninitialised if the engine has not been initialised', () => {
      const engine = new Engine(emptyDirectory)

      expect(engine.getState()).toBe(RepoState.UNINITIALISED)
    })

    it('should be EMPTY on starting in an empty directory', async () => {
      const engine = new Engine(emptyDirectory)

      const { success } = await engine.init()

      expect(success).toBe(true)
      expect(engine.getState()).toBe(RepoState.EMPTY)
    })

    it('should be INVALID on none json in adventure file', async () => {
      const engine = new Engine(noneJsonAdventureFile)

      const { success, error } = await engine.init()

      expect(success).toBe(false)
      expect(error).toBe('Unable to read `adventure.json` file')
      expect(engine.getState()).toBe(RepoState.INVALID)
    })
  })

  describe('repo setup', () => {
    beforeEach(() => {
      mock({
        [emptyDirectory]: {},
      })
    })

    afterEach(() => {
      mock.restore()
    })

    it('should setup on empty directory', async () => {
      const engine = new Engine(emptyDirectory)

      const { success } = await engine.init()
      expect(success).toBe(true)

      await engine.apply(setup({ name: 'example' }))

      expect(engine.getState()).toBe(RepoState.VALID)

      const adventureFileText = readFileSync(
        join(emptyDirectory, 'adventure.json'),
      )

      expect(JSON.parse(adventureFileText.toString())).toStrictEqual({
        name: 'example',
        version: '0.1',
        edition: 5,
        levels: '1-5',
        description: '',
      })
    })
  })

  describe('adventure updates', () => {
    let engine: Engine
    beforeEach(async () => {
      mock({
        [basicAdventureDirectory]: {
          'adventure.json': JSON.stringify(exampleAdventure),
        },
      })

      engine = new Engine(basicAdventureDirectory)

      const { success } = await engine.init()
      expect(success).toBe(true)
    })

    afterEach(() => {
      mock.restore()
    })

    it('should allow updating adventure name', async () => {
      await engine.apply(updateAdventureName({ name: 'changed' }))

      const expectedAdventure: AdventureInfo = {
        name: 'changed',
        version: '0.1',
        edition: 5,
        levels: '2-9',
        description: 'The one with the green knight',
      }

      expectAdventureStateAndFileToBe(
        engine,
        basicAdventureDirectory,
        expectedAdventure,
      )
    })

    it('should allow updating adventure levels', async () => {
      await engine.apply(
        updateAdventureLevels({ startingLevel: 11, endingLevel: 14 }),
      )

      const expectedAdventure: AdventureInfo = {
        name: 'Challenge in Green',
        version: '0.1',
        edition: 5,
        levels: '11-14',
        description: 'The one with the green knight',
      }

      expectAdventureStateAndFileToBe(
        engine,
        basicAdventureDirectory,
        expectedAdventure,
      )
    })

    it('should allow updating adventure description', async () => {
      await engine.apply(
        updateAdventureDescription({ description: 'No the other one' }),
      )

      const expectedAdventure: AdventureInfo = {
        name: 'Challenge in Green',
        version: '0.1',
        edition: 5,
        levels: '2-9',
        description: 'No the other one',
      }

      expectAdventureStateAndFileToBe(
        engine,
        basicAdventureDirectory,
        expectedAdventure,
      )
    })
  })

  describe('chapter updates', () => {
    let engine: Engine
    beforeEach(async () => {
      mock({
        [basicAdventureDirectory]: {
          'adventure.json': JSON.stringify(exampleAdventure),
          chapters: {},
        },
        [adventureWithChapters]: {
          'adventure.json': JSON.stringify(exampleAdventure),
          chapters: {
            '1-on-a-moor': {
              'chapter.md': space`
                ---
                id: ef059162-ad39-48e9-bbdd-c94e10d08cfb
                name: On a moor
                ---

                Fog drifts over a lonely moor as ...
              `,
            },
            '2-in-a-cave': {
              'chapter.md': space`
                ---
                id: ea2a1776-c2be-4b5e-aca0-16f54ec02d07
                name: In a Cave
                ---

                The drip and dank of the sea cave hold your attention when ...
              `,
            },
          },
        },
      })
    })

    afterEach(() => {
      mock.restore()
    })

    it('should allow adding a first chapter', async () => {
      engine = new Engine(basicAdventureDirectory)

      const { success } = await engine.init()
      expect(success).toBe(true)

      const chapterId = toGuid(toGuid('2b49ab2d-0af5-4323-ad21-de441cfd9862'))

      await engine.apply(
        addChapter({ id: chapterId, name: 'It begins in a tavern' }),
      )

      const expectedAdventure: AdventureInfo = {
        name: 'Challenge in Green',
        version: '0.1',
        edition: 5,
        levels: '2-9',
        description: 'The one with the green knight',
      }

      expectAdventureStateAndFileToBe(
        engine,
        basicAdventureDirectory,
        expectedAdventure,
        [chapterId],
      )

      const chapterFileText = readFileSync(
        join(
          basicAdventureDirectory,
          'chapters',
          '1-it-begins-in-a-tavern',
          'chapter.md',
        ),
      )

      const expectedChapterText = space`
        ---
        id: 2b49ab2d-0af5-4323-ad21-de441cfd9862
        name: It begins in a tavern
        ---

        And so our adventurers where in the pub when ...`

      expect(chapterFileText.toString()).toStrictEqual(expectedChapterText)

      // Expect chapter state

      expect(
        engine.getChapter(toGuid('2b49ab2d-0af5-4323-ad21-de441cfd9862')),
      ).toStrictEqual({
        id: toGuid('2b49ab2d-0af5-4323-ad21-de441cfd9862'),
        name: 'It begins in a tavern',
        slug: 'it-begins-in-a-tavern',
        body: 'And so our adventurers where in the pub when ...',
      })
    })

    it('should allow adding a chapter after existing chapters', async () => {
      engine = new Engine(adventureWithChapters)

      const { success } = await engine.init()
      expect(success).toBe(true)

      const chapterId = toGuid('917de715-1721-4fb9-9526-df8dba28d536')

      await engine.apply(addChapter({ id: chapterId, name: 'In a lava pit' }))

      const expectedAdventure: AdventureInfo = {
        name: 'Challenge in Green',
        version: '0.1',
        edition: 5,
        levels: '2-9',
        description: 'The one with the green knight',
      }

      expectAdventureStateAndFileToBe(
        engine,
        adventureWithChapters,
        expectedAdventure,
        [
          toGuid('ef059162-ad39-48e9-bbdd-c94e10d08cfb'),
          toGuid('ea2a1776-c2be-4b5e-aca0-16f54ec02d07'),
          chapterId,
        ],
      )

      const chapterFileText = readFileSync(
        join(
          adventureWithChapters,
          'chapters',
          '3-in-a-lava-pit',
          'chapter.md',
        ),
      )

      const expectedChapterText = space`
        ---
        id: 917de715-1721-4fb9-9526-df8dba28d536
        name: In a lava pit
        ---

        And so our adventurers where in the pub when ...`

      expect(chapterFileText.toString()).toStrictEqual(expectedChapterText)

      expect(
        engine.getChapter(toGuid('917de715-1721-4fb9-9526-df8dba28d536')),
      ).toStrictEqual({
        id: toGuid('917de715-1721-4fb9-9526-df8dba28d536'),
        name: 'In a lava pit',
        slug: 'in-a-lava-pit',
        body: 'And so our adventurers where in the pub when ...',
      })
    })
  })
})
