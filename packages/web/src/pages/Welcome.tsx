import React, {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import Layout from '../components/Layout'
import { LoadingStates } from '../domain'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/rootReducer'

export const Welcome: React.FC<{
  loading: boolean
  name: string
  description: string
  edition: string
  startingLevel: number
  endingLevel: number
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void
  onDescriptionChange: (event: ChangeEvent<HTMLTextAreaElement>) => void
  onStartingLevelChange: (event: ChangeEvent<HTMLInputElement>) => void
  onEndingLevelChange: (event: ChangeEvent<HTMLInputElement>) => void
}> = memo(
  ({
    loading,
    name,
    description,
    edition,
    startingLevel,
    endingLevel,
    onNameChange,
    onDescriptionChange,
    onStartingLevelChange,
    onEndingLevelChange,
  }) => {
    if (loading) {
      return <div>Loading ...</div>
    }

    return (
      <div>
        <form>
          <input type="text" onChange={onNameChange} value={name} />
        </form>

        <p>
          A D &amp; D {edition}e Adventure for levels{' '}
          <input
            type="number"
            min={1}
            max={20}
            onChange={onStartingLevelChange}
            value={startingLevel}
          />{' '}
          -{' '}
          <input
            type="number"
            min={1}
            max={20}
            onChange={onEndingLevelChange}
            value={endingLevel}
          />
          .
        </p>
        <form>
          <textarea onChange={onDescriptionChange} value={description} />
        </form>
      </div>
    )
  },
)

const SmartWelcome = () => {
  const { loading, adventure } = useSelector((state: RootState) => ({
    loading: state.loading.state !== LoadingStates.COMPLETE,
    adventure: state.adventure,
  }))

  const [adventureName, setAdventureName] = useState('')
  const onAdventureNameChange = useCallback(
    (ev) => setAdventureName(ev.target.value),
    [],
  )

  const [adventureDescription, setAdventureDescription] = useState('')
  const onAdventureDescriptionChange = useCallback(
    (ev) => setAdventureDescription(ev.target.value),
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
    if (loading || !adventure) {
      return
    }

    setAdventureName(adventure.name)
    setAdventureDescription(adventure.description)
    setAdventureEdition(adventure.edition)

    const parts = adventure.levels.split('-')

    setStartingLevel(parseInt(parts[0]))
    setEndingLevel(parseInt(parts[1]))
  }, [adventure, loading])

  return (
    <Layout>
      <Welcome
        loading={loading}
        name={adventureName}
        description={adventureDescription}
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
