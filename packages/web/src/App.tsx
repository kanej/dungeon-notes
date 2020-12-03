import { useEffect, useState } from 'react'
import unified from 'unified'
import markdown from 'remark-parse'
import slate from 'remark-slate'
import Scene from './Scene'

function App() {
  const [loading, setLoading] = useState(true)
  const [savedDoc, setSavedDoc] = useState<any | undefined>(undefined)

  useEffect(() => {
    let mounted = true
    const runLoad = async () => {
      const response = await fetch('/api')

      const text = await response.text()

      if (!mounted) {
        return
      }

      const processed = await unified().use(markdown).use(slate).process(text)

      const doc: any = processed.result

      setSavedDoc(doc)
      setLoading(false)
    }

    runLoad()

    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return <div>loading...</div>
  }

  return <Scene initialDoc={savedDoc} />
}

export default App
