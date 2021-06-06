import Server from './express/server'

const main = async () => {
  const port = 9898
  const basePath = '../../tmp/adventure'

  const server = new Server(basePath, port)

  try {
    return server.listen()
  } catch (error) {
    console.log(error.message)
  }
}

main()
