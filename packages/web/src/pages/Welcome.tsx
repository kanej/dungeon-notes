import { useCallback, useEffect, useState } from 'react'
import unified from 'unified'
import markdown from 'remark-parse'
import slate from 'remark-slate'
import Layout from '../components/Layout'
import { LoadingStates } from '../domain'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../redux/rootReducer'
import AdventureDetails from '../components/AdventureDetails'
import useDebounce from '../hooks/useDebounce'
import {
  updateAdventureDescription,
  updateAdventureLevels,
  updateAdventureName,
} from '../redux/slices/adventureSlices'

const markdownToSlateConvertor = unified().use(markdown).use(slate)

const SmartWelcome = () => {
  const dispatch = useDispatch()
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

  const [adventureDescription, setAdventureDescription] = useState<
    null | string
  >(null)
  const onAdventureDescriptionChange = useCallback(
    (text) => setAdventureDescription(text),
    [],
  )

  const [adventureEdition, setAdventureEdition] = useState(5)

  const [startingLevel, setStartingLevel] = useState<null | number>(null)
  const onStartingLevelChange = useCallback(
    (ev) => setStartingLevel(parseInt(ev.target.value)),
    [],
  )

  const [endingLevel, setEndingLevel] = useState<null | number>(null)
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

  const debouncedAdventureName = useDebounce(adventureName, 2000)

  const debouncedStartingLevel = useDebounce(startingLevel, 2000)
  const debouncedEndingLevel = useDebounce(endingLevel, 2000)

  const debouncedDescription = useDebounce(adventureDescription, 2000)

  useEffect(() => {
    if (loading) {
      return
    }

    let mounted = true

    const runUpdateName = async () => {
      if (!mounted) {
        return
      }

      if (debouncedAdventureName.length <= 4) {
        return
      }

      const command = updateAdventureName({ name: debouncedAdventureName })

      const response = await fetch('http://localhost:9898/api/adventure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      })

      if (response.status !== 200) {
        return
      }

      dispatch(command)
    }

    runUpdateName()

    return () => {
      mounted = false
    }
  }, [debouncedAdventureName, dispatch, loading])

  useEffect(() => {
    if (loading) {
      return
    }

    let mounted = true

    const runUpdateLevels = async () => {
      if (!mounted) {
        return
      }

      if (!debouncedStartingLevel || !debouncedEndingLevel) {
        return
      }

      const command = updateAdventureLevels({
        startingLevel: debouncedStartingLevel,
        endingLevel: debouncedEndingLevel,
      })

      const response = await fetch('http://localhost:9898/api/adventure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      })

      if (response.status !== 200) {
        console.error((await response.json()).error)
        return
      }

      dispatch(command)
    }

    runUpdateLevels()

    return () => {
      mounted = false
    }
  }, [debouncedEndingLevel, debouncedStartingLevel, dispatch, loading])

  useEffect(() => {
    if (loading) {
      return
    }

    let mounted = true

    const runUpdateDescription = async () => {
      if (!mounted) {
        return
      }

      if (!debouncedDescription) {
        return
      }

      const command = updateAdventureDescription({
        description: debouncedDescription,
      })

      const response = await fetch('http://localhost:9898/api/adventure', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(command),
      })

      if (response.status !== 200) {
        console.error((await response.json()).error)
        return
      }

      dispatch(command)
    }

    runUpdateDescription()

    return () => {
      mounted = false
    }
  }, [debouncedDescription, dispatch, loading])

  if (loading) {
    return (
      <Layout>
        <div>Loading ...</div>
      </Layout>
    )
  }

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
