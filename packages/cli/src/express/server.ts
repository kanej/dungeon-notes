import path from 'path'
import { Engine, RepoState } from '@dungeon-notes/engine'
import { Adventure } from '@dungeon-notes/types'
import cors from 'cors'
import express from 'express'

export default class Server {
  private basePath: string

  private port: number

  private engine: Engine

  adventure: Adventure | undefined = undefined

  constructor(basePath: string, port: number) {
    this.basePath = basePath
    this.port = port

    this.engine = new Engine(this.basePath)
  }

  async listen(): Promise<void> {
    const { success, error } = await this.engine.init()

    if (!success) {
      throw new Error(error)
    }

    const app = express()
    app.use(cors())
    app.use(express.static(path.resolve(__dirname, '../../www')))

    app.get('/api/adventure', async (_request, response) => {
      response.json(this.engine.getAdventure())
    })

    app.get('/api/adventure/chapters', async (_request, response) => {
      response.json(this.engine.getChapters())
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
        console.error(error)
        return response.status(500).send({ error })
      }
    })

    app.listen(this.port, () => {
      console.log(
        `Dungeon Notes Writer listening at http://localhost:${this.port}`,
      )
    })
  }
}
