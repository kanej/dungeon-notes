import React, { ChangeEvent, memo } from 'react'
import styled from 'styled-components'
import { MAX_ADVENTURE_NAME_LENGTH } from '../constants'
import PluginEditor from './PluginEditor'

const AdventureDetails: React.FC<{
  loading: boolean
  name: string
  description: any
  edition: number
  startingLevel: number | null
  endingLevel: number | null
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void
  onDescriptionChange: (text: string) => void
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
          <NameInput
            type="text"
            maxLength={MAX_ADVENTURE_NAME_LENGTH}
            value={name}
            onChange={onNameChange}
          />
        </form>

        <LevelText>
          A D &amp; D {edition}e Adventure for levels{' '}
          <LevelInput
            type="number"
            min={1}
            max={20}
            value={startingLevel || 1}
            onChange={onStartingLevelChange}
          />{' '}
          -{' '}
          <LevelInput
            type="number"
            min={1}
            max={20}
            value={endingLevel || 10}
            onChange={onEndingLevelChange}
          />
          .
        </LevelText>

        <DescriptionWrap>
          <PluginEditor value={description} onSave={onDescriptionChange} />
        </DescriptionWrap>
      </div>
    )
  },
)

const NameInput = styled.input`
  width: 100%;

  background: none;
  border: none;
  outline: none;
  font-size: 24px;

  border-bottom: 1px solid lightgray;
`

const LevelText = styled.p`
  font-size: 18px;
`

const LevelInput = styled.input`
  background: none;
  border: none;
  outline: none;
  font-size: 18px;
  text-align: center;

  &::-webkit-inner-spin-button {
    opacity: 1;
    margin-left: 4px;
  }
`

const DescriptionWrap = styled.div`
  font-size: 18px;
`

export default memo(AdventureDetails)
