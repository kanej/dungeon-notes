import { useEffect, useState } from 'react'
import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client'
import { ApolloProvider } from '@apollo/client'
import unified from 'unified'
import markdown from 'remark-parse'
import slate from 'remark-slate'
import Scene from './Scene'
import Welcome from './Welcome'
import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`

function App() {
  const [loading, setLoading] = useState(true)
  const [savedDoc, setSavedDoc] = useState<any | undefined>(undefined)
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

    let mounted = true
    const runLoad = async () => {
      // const response = await fetch('/api')

      // const text = await response.text()

      // if (!mounted) {
      //   return
      // }

      // const processed = await unified().use(markdown).use(slate).process(text)

      // const doc: any = processed.result

      // setSavedDoc(doc)
      setLoading(false)
    }

    runLoad()

    return () => {
      mounted = false
    }
  }, [apolloClient])

  if (loading || !apolloClient) {
    return <div>loading...</div>
  }

  return (
    <ApolloProvider client={apolloClient}>
      {/* <Scene initialDoc={savedDoc} /> */}
      <Welcome />
      <GlobalStyle />
    </ApolloProvider>
  )
}

export default App
