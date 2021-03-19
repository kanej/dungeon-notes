import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { ApolloServer } from 'apollo-server-express'
import express from 'express'

import { Chapter } from '../domain'
import ChapterService from '../services/chapter-service'
import FileStore from '../services/file-store'
import schema from './schema'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

export default class Server {
  basePath: string

  port: number

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
    const adventureInfo = await this._readAdventureFile(this.basePath)

    await this.chapterService.load()

    const app = express()

    const resolvers = {
      Query: {
        adventure: () => {
          return {
            ...adventureInfo,
            chapters: this.chapterService.listNames(),
          }
        },
        chapter: async (_: any, { slug }: { slug: string }) => {
          const chapter = this.chapterService.get(slug)

          return chapter
        },
      },
      Mutation: {
        addChapter: (_: any, { name }: { name: string }) => {
          return this.chapterService.add(name)
        },
        updateChapterBody: (
          _: any,
          { slug, body }: { slug: string; body: string },
        ) => {
          return this.chapterService.updateBody(slug, body)
        },
      },
    }

    const server = new ApolloServer({
      typeDefs: schema,
      resolvers,
    })

    server.applyMiddleware({ app })

    // app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }))

    // app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

    app.get('/api', async (_request, response) => {
      const contents = await readFile(this.basePath)

      response.setHeader('content-type', 'text/markdown')
      response.send(contents.toString())
    })

    app.post('/api', express.text(), async (request, response) => {
      // const contents = await readFile(filePath)
      await writeFile(this.basePath, request.body)

      response.status(200).send()
    })

    app.listen(this.port, () => {
      console.log(
        `DM Notes listening at http://localhost:${this.port}${server.graphqlPath}`,
      )
    })
  }

  private async _readAdventureFile(basePath: string) {
    const adventureFilePath = path.join(basePath, 'adventure.json')

    try {
      const content = await readFile(adventureFilePath)

      const json = JSON.parse(content.toString())

      return json
    } catch {
      throw new Error('No `adventure.json` file.')
    }
  }
}
