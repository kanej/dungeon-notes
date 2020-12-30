import fs from 'fs'
import path from 'path'
import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { promisify } from 'util'

import AdventureService from '../services/adventure-service'
import { Adventure } from '../domain'
import schema from './schema'
import FileStore from '../services/file-store'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

export default class Server {
  basePath: string

  port: number

  adventures: { [key: string]: Adventure }

  adventureService: AdventureService

  constructor(basePath: string, port: number) {
    this.basePath = basePath
    this.port = port

    this.adventures = {}

    const fileStore = new FileStore(basePath)
    this.adventureService = new AdventureService(fileStore, this.adventures)
  }

  async listen(): Promise<void> {
    const campaignInfo = await this._readCampaignFile(this.basePath)

    await this.adventureService.load()

    const app = express()

    const resolvers = {
      Query: {
        campaign: () => {
          return {
            ...campaignInfo,
            adventures: this.adventureService.listNames(),
          }
        },
        adventure: async (_: any, { slug }: { slug: string }) => {
          const adventure = this.adventureService.get(slug)

          return adventure
        },
      },
      Mutation: {
        addAdventure: (_: any, { name }: { name: string }) => {
          return this.adventureService.add(name)
        },
        updateAdventureBody: (
          _: any,
          { slug, body }: { slug: string; body: string },
        ) => {
          return this.adventureService.updateBody(slug, body)
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

  private async _readCampaignFile(basePath: string) {
    const campaignFilePath = path.join(basePath, 'campaign.json')

    try {
      const content = await readFile(campaignFilePath)

      const json = JSON.parse(content.toString())

      return json
    } catch {
      throw new Error('No `campaign.json` file.')
    }
  }
}
