import { useEffect, useState } from 'react'
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { createGlobalStyle } from 'styled-components'
import { useDispatch } from 'react-redux'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import SmartWelcome from './pages/Welcome'
import SmartChapter from './pages/Chapter'
import ADVENTURE_QUERY from './queries/adventureQuery'
import { setAdventure } from './redux/slices/adventureSlices'
import { complete } from './redux/slices/loadingSlice'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  // const [savedDoc, setSavedDoc] = useState<any | undefined>(undefined)
  const [apolloClient, setApolloClient] = useState<
    undefined | ApolloClient<NormalizedCacheObject>
  >(undefined)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      const client = new ApolloClient({
        uri: 'http://localhost:9898/graphql',
        cache: new InMemoryCache(),
      })

      setApolloClient(client)

      const adventureResponse = await client.query({ query: ADVENTURE_QUERY })

      if (!mounted) {
        return
      }

      dispatch(
        setAdventure({ ...adventureResponse.data.adventure, chapters: [] }),
      )

      dispatch(complete())

      // const chaptersResponse = await client.query({ query: CHAPTERS_QUERY })

      // console.log(chaptersResponse.data.adventure.chapters)
    }

    run()

    return () => {
      mounted = false
    }
  }, [dispatch])

  useEffect(() => {
    if (!apolloClient) {
      return
    }

    setLoading(false)
  }, [apolloClient])

  if (loading || !apolloClient) {
    return <div>loading...</div>
  }

  return (
    <ApolloProvider client={apolloClient}>
      <Router>
        <Route exact path="/:chapter">
          <SmartChapter />
        </Route>
        <Route exact path="/">
          <SmartWelcome />
        </Route>
      </Router>
      <GlobalStyle />
    </ApolloProvider>
  )
}

export default App
