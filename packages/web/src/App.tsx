import { useEffect, useState } from 'react'
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { ApolloProvider } from '@apollo/client'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import SmartWelcome from './pages/Welcome'
import SmartAdventure from './pages/Adventure'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`

function App() {
  const [loading, setLoading] = useState(true)
  // const [savedDoc, setSavedDoc] = useState<any | undefined>(undefined)
  const [apolloClient, setApolloClient] = useState<
    undefined | ApolloClient<NormalizedCacheObject>
  >(undefined)

  useEffect(() => {
    const client = new ApolloClient({
      uri: 'http://localhost:9898/graphql',
      cache: new InMemoryCache(),
    })

    setApolloClient(client)
  }, [])

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
        <Route exact path="/:adventure">
          <SmartAdventure />
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
