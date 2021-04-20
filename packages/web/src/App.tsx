import { Adventure, Chapter, setAdventure } from '@dungeon-notes/types'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { createGlobalStyle } from 'styled-components'
import SmartAdventure from './pages/Adventure'
import SmartChapter from './pages/Chapter'
import { complete } from './redux/slices/loadingSlice'

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`

const App: React.FC = () => {
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

      const chapterResponse = await fetch(
        'http://localhost:9898/api/adventure/chapters',
      )

      const chapters: Chapter[] = await chapterResponse.json()

      if (!mounted) {
        return
      }

      dispatch(setAdventure({ adventure, chapters }))
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
        <Switch>
          <Route
            exact
            path="/chapters/:chapterId/:chapterSlug"
            render={({
              match: {
                params: { chapterId },
              },
            }) => {
              return <SmartChapter key={chapterId} />
            }}
          />
          <Route exact path="/">
            <SmartAdventure />
          </Route>
          <Route path="*">
            <p>Not found</p>
          </Route>
        </Switch>
      </Router>
      <GlobalStyle />
    </>
  )
}

export default App
