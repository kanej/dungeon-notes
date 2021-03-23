import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { Engine, RepoState } from '@dungeon-notes/engine'
import cors from 'cors'
import express from 'express'
import { Adventure, AdventureInfo, Chapter } from '../domain'
import ChapterService from '../services/chapter-service'
import FileStore from '../services/file-store'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

export default class Server {
  private basePath: string

  private port: number

  private engine: Engine

  adventure: Adventure | undefined = undefined

  chapters: { [key: string]: Chapter }

  chapterService: ChapterService

  constructor(basePath: string, port: number) {
    this.basePath = basePath
    this.port = port

    this.engine = new Engine(this.basePath)

    this.chapters = {}

    const fileStore = new FileStore(basePath)
    this.chapterService = new ChapterService(fileStore, this.chapters)
  }

  async listen(): Promise<void> {
    const { success, error } = await this.engine.init()

    if (!success) {
      throw new Error(error)
    }

    this.adventure = await this._readAdventureFile(this.basePath)
    await this.chapterService.load()

    const app = express()
    app.use(cors())
    app.use(express.static(path.resolve(__dirname, '../../www')))

    app.get('/api/adventure', async (_request, response) => {
      response.json(this.engine.getAdventure())
    })

    app.post('/api/adventure', express.json(), async (request, response) => {
      const { type, payload } = request.body

      if (this.engine.getState() !== RepoState.VALID) {
        return response.status(500).send({ error: 'Adventure repo not loaded' })
      }

      try {
        await this.engine.apply({ type, payload })

        return response.send({})
      } catch (error) {
        return response.status(500).send({ error })
      }
    })

    app.listen(this.port, () => {
      console.log(
        `Dungeon Notes Writer listening at http://localhost:${this.port}`,
      )
    })
  }

  private async _readAdventureFile(basePath: string) {
    const adventureFilePath = path.join(basePath, 'adventure.json')

    try {
      const content = await readFile(adventureFilePath)

      const json: AdventureInfo = JSON.parse(content.toString())

      return {
        ...json,
        chapters: [],
      }
    } catch {
      throw new Error('No `adventure.json` file.')
    }
  }

  private async _writeAdventureFile(basePath: string, adventure: Adventure) {
    const adventureFilePath = path.join(basePath, 'adventure.json')

    try {
      const adventureInfo: AdventureInfo = {
        name: adventure.name,
        version: adventure.version,
        edition: adventure.edition,
        levels: adventure.levels,
        description: adventure.description,
      }

      return writeFile(
        adventureFilePath,
        JSON.stringify(adventureInfo, undefined, 2),
      )
    } catch {
      throw new Error("Unable to write to 'adventure.json' file")
    }
  }
}
