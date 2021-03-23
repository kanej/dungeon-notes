import * as fs from 'fs'
import * as path from 'path'
import mock from 'mock-fs'
import { AdventureInfo, RepoState } from './domain'
import Engine from './engine'
import { setup } from './redux/slices/repoSlice'

const exampleAdventure: AdventureInfo = {
  name: 'Challenge in Green',
  version: '0.1',
  edition: 5,
  levels: '1-5',
  description: 'The one with the green knight',
}

describe('Engine', () => {
  const emptyDirectory = 'test/empty'
  const basicAdventureDirectory = 'test/basic'
  const noneJsonAdventureFile = 'test/nonjson'

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

      const adventureFileText = fs.readFileSync(
        path.join(emptyDirectory, 'adventure.json'),
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
})
