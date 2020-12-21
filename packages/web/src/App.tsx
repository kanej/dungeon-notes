import { memo, useEffect, useState } from 'react'
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { ApolloProvider } from '@apollo/client'
// import unified from 'unified'
// import markdown from 'remark-parse'
// import slate from 'remark-slate'
// import Scene from './Scene'
import SmartWelcome from './Welcome'
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
      {/* <Scene initialDoc={savedDoc} /> */}
      <SmartWelcome />
      <GlobalStyle />
    </ApolloProvider>
  )
}

export default App
