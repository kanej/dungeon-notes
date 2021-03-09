import { useCallback, useEffect, useState } from 'react'
import unified from 'unified'
import markdown from 'remark-parse'
import slate from 'remark-slate'
import Layout from '../components/Layout'
import { LoadingStates } from '../domain'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/rootReducer'
import AdventureDetails from '../components/AdventureDetails'

const markdownToSlateConvertor = unified().use(markdown).use(slate)

const SmartWelcome = () => {
  const { loading: adventureLoading, adventure } = useSelector(
    (state: RootState) => ({
      loading: state.loading.state !== LoadingStates.COMPLETE,
      adventure: state.adventure,
    }),
  )

  const [loading, setLoading] = useState(true)

  const [adventureName, setAdventureName] = useState('')
  const onAdventureNameChange = useCallback(
    (ev) => setAdventureName(ev.target.value),
    [],
  )

  const [slateInitialState, setSlateInitialState] = useState<any | null>(null)

  const [, setAdventureDescription] = useState('')
  const onAdventureDescriptionChange = useCallback(
    (text) => setAdventureDescription(text),
    [],
  )

  const [adventureEdition, setAdventureEdition] = useState('5')

  const [startingLevel, setStartingLevel] = useState(1)
  const onStartingLevelChange = useCallback(
    (ev) => setStartingLevel(parseInt(ev.target.value)),
    [],
  )

  const [endingLevel, setEndingLevel] = useState(10)
  const onEndingLevelChange = useCallback(
    (ev) => setEndingLevel(parseInt(ev.target.value)),
    [],
  )

  useEffect(() => {
    if (adventureLoading || !adventure) {
      return
    }

    let mounted = true

    const loadAdventure = async () => {
      if (!mounted) {
        return
      }

      setAdventureName(adventure.name)

      setAdventureEdition(adventure.edition)

      const parts = adventure.levels.split('-')

      setStartingLevel(parseInt(parts[0]))
      setEndingLevel(parseInt(parts[1]))

      setAdventureDescription(adventure.description)
      const slateState = await markdownToSlateConvertor.process(
        adventure.description,
      )

      setSlateInitialState(slateState.result)
      setLoading(false)
    }

    loadAdventure()

    return () => {
      mounted = false
    }
  }, [adventure, adventureLoading])

  return (
    <Layout>
      <AdventureDetails
        loading={loading}
        name={adventureName}
        description={slateInitialState}
        edition={adventureEdition}
        startingLevel={startingLevel}
        endingLevel={endingLevel}
        onNameChange={onAdventureNameChange}
        onDescriptionChange={onAdventureDescriptionChange}
        onStartingLevelChange={onStartingLevelChange}
        onEndingLevelChange={onEndingLevelChange}
      />
    </Layout>
  )
}

export default SmartWelcome
