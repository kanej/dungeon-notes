import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import cors from 'cors'
import express from 'express'
import { Adventure, AdventureInfo, Chapter } from '../domain'
import ChapterService from '../services/chapter-service'
import FileStore from '../services/file-store'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

export default class Server {
  basePath: string

  port: number

  adventure: Adventure | undefined = undefined

  chapters: { [key: string]: Chapter }

  chapterService: ChapterService

  constructor(basePath: string, port: number) {
    this.basePath = basePath
    this.port = port

    this.chapters = {}

    const fileStore = new FileStore(basePath)
    this.chapterService = new ChapterService(fileStore, this.chapters)
  }

  async listen(): Promise<void> {
    this.adventure = await this._readAdventureFile(this.basePath)
    await this.chapterService.load()

    const app = express()
    app.use(cors())
    app.use(express.static('./www'))

    app.get('/api/adventure', async (_request, response) => {
      response.json(this.adventure)
    })

    app.post('/api/adventure', express.json(), async (request, response) => {
      const { type, payload } = request.body

      if (!this.adventure) {
        return response.status(500).send({ error: 'adventure not loaded' })
      }

      if (type === 'adventure/updateAdventureName') {
        this.adventure.name = payload.name

        await this._writeAdventureFile(this.basePath, this.adventure)

        return response.send({})
      }

      if (type === 'adventure/updateAdventureLevels') {
        const { startingLevel, endingLevel } = payload

        this.adventure.levels = `${startingLevel}-${endingLevel}`

        await this._writeAdventureFile(this.basePath, this.adventure)

        return response.send({})
      }

      if (type === 'adventure/updateAdventureDescription') {
        const { description } = payload

        if (!description) {
          return response
            .status(400)
            .send({ error: 'Description must be a string' })
        }

        this.adventure.description = description

        await this._writeAdventureFile(this.basePath, this.adventure)

        return response.send({})
      }

      return response
        .status(400)
        .send({ error: `Unknown command type: ${type}` })
    })

    app.get('/api', async (_request, response) => {
      const contents = await readFile(this.basePath)

      response.setHeader('content-type', 'text/markdown')
      response.send(contents.toString())
    })

    app.post('/api', express.text(), async (request, response) => {
      await writeFile(this.basePath, request.body)

      response.status(200).send()
    })

    app.listen(this.port, () => {
      console.log(`DM Notes listening at http://localhost:${this.port}`)
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
