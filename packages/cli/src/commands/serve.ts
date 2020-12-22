import { Command, flags } from '@oclif/command'
import Server from '../graphql/server'

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

  async run(): Promise<void> {
    const { args, flags } = this.parse(Serve)

    const port = flags.port
    const basePath = args.file

    this.log(`Starting server: ${basePath}`)

    const server = new Server(basePath, port)

    try {
      return server.listen()
    } catch (error) {
      this.log(error.message)
      this.exit(1)
    }
  }
}
