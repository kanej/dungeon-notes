import Server from './graphql/server'

const main = async () => {
  const port = 9898
  const basePath = '../../examples/basic'

  const server = new Server(basePath, port)

  try {
    return server.listen()
  } catch (error) {
    console.log(error.message)
  }
}

main()
