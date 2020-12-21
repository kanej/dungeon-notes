import { Command, flags } from '@oclif/command'
import fs from 'fs'
import path from 'path'
import express from 'express'
import bodyParser from 'body-parser'

import { ApolloServer, gql } from 'apollo-server-express'
import { promisify } from 'util'
import AdventureService from '../services/AdventureService'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const schema = gql`
  type Query {
    campaign: Campaign
  }

  type Mutation {
    addAdventure(name: String!): AdventureDescription!
  }

  type Campaign {
    name: String!
    edition: Int!
    levels: String!
    description: String!
    adventures: [AdventureDescription]
  }

  type AdventureDescription {
    name: String!
    slug: String!
  }
`

export default class Serve extends Command {
  static description = 'serves the notes'

  static examples = [`$ dmnotes serve`]

  static flags = {
    help: flags.help({ char: 'h' }),
    port: flags.integer({
      char: 'p',
      default: 9898,
      description: 'the port to serve on',
    }),
  }

  static args = [{ name: 'file', required: false, default: '.' }]

  async run() {
    const { args, flags } = this.parse(Serve)

    const port = flags.port
    const basePath = args.file

    const campaignInfo = await this._readCampaignFile(basePath)
    const adventures = {}

    const adventureService = new AdventureService(adventures)

    this.log(`Starting server: ${basePath}`)

    const app = express()

    const resolvers = {
      Query: {
        campaign: () => ({
          ...campaignInfo,
          adventures: adventureService.listNames(),
        }),
      },
      Mutation: {
        addAdventure: async (_: any, { name }: { name: string }) => {
          return adventureService.add(name)
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

    app.get('/api', async (_req, res) => {
      const contents = await readFile(basePath)

      res.setHeader('content-type', 'text/markdown')
      res.send(contents.toString())
    })

    app.post('/api', express.text(), async (req, res) => {
      // const contents = await readFile(filePath)
      await writeFile(basePath, req.body)

      res.status(200).send()
    })

    app.listen(port, () => {
      console.log(
        `DM Notes listening at http://localhost:${port}${server.graphqlPath}`,
      )
    })
  }

  private async _readCampaignFile(basePath: string) {
    const campaignFilePath = path.join(basePath, 'campaign.json')

    try {
      const content = await readFile(campaignFilePath)

      const json = JSON.parse(content.toString())

      return json
    } catch (err) {
      this.error('No `campaign.json` file.')
    }
  }
}
