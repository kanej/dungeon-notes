import { Command, flags } from '@oclif/command'
import fs from 'fs'
import express from 'express'
import { promisify } from 'util'

const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

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

  static args = [{ name: 'file', required: true }]

  async run() {
    const { args, flags } = this.parse(Serve)

    const port = flags.port
    const filePath = args.file
    this.log(`Starting server: ${filePath}`)

    const app = express()

    app.get('/api', async (_req, res) => {
      const contents = await readFile(filePath)

      res.setHeader('content-type', 'text/markdown')
      res.send(contents.toString())
    })

    app.post('/api', express.text(), async (req, res) => {
      // const contents = await readFile(filePath)
      await writeFile(filePath, req.body)

      res.status(200).send()
    })

    app.listen(port, () => {
      console.log(`DM Notes listening at http://localhost:${port}`)
    })
  }
}
