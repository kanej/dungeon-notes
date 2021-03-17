import { useEffect, useState } from 'react'
import { createGlobalStyle } from 'styled-components'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import SmartWelcome from './pages/Welcome'
import SmartChapter from './pages/Chapter'
import { setAdventure } from './redux/slices/adventureSlices'
import { complete } from './redux/slices/loadingSlice'
import { Adventure } from './domain'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`

function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!mounted) {
        return
      }

      const response = await fetch('http://localhost:9898/api/adventure')

      const adventure: Adventure = await response.json()

      if (!mounted) {
        return
      }

      dispatch(setAdventure(adventure))

      dispatch(complete())

      setLoading(false)
    }

    run()

    return () => {
      mounted = false
    }
  }, [dispatch])

  if (loading) {
    return <div>loading...</div>
  }

  return (
    <>
      <Router>
        <Route exact path="/:chapter">
          <SmartChapter />
        </Route>
        <Route exact path="/">
          <SmartWelcome />
        </Route>
      </Router>
      <GlobalStyle />
    </>
  )
}

export default App
