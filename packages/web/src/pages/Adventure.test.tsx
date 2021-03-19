import { render, screen } from '@testing-library/react'
import React from 'react'
import AdventureDetails from '../components/AdventureDetails'
import { Adventure } from '../domain'

const noop = () => {
  // Do nothing
}

const exampleAdventure: Adventure = {
  name: 'Dungeon of Doom',
  version: '0.1',
  description: 'Fun in a dungeon',
  levels: '3-8',
  edition: 5,
  chapters: [],
}

test('Renders adventure description', () => {
  render(
    <AdventureDetails
      loading={false}
      name={exampleAdventure.name}
      description={[]}
      edition={exampleAdventure.edition}
      startingLevel={3}
      endingLevel={8}
      onNameChange={noop}
      onDescriptionChange={noop}
      onStartingLevelChange={noop}
      onEndingLevelChange={noop}
    />,
  )
  const title = screen.getByDisplayValue(/Dungeon of Doom/i)
  expect(title).toBeInTheDocument()

  const startingLevel = screen.getByDisplayValue(/3/i)
  expect(startingLevel).toBeInTheDocument()

  const endingLevel = screen.getByDisplayValue(/8/i)
  expect(endingLevel).toBeInTheDocument()
})

test('Renders loading', () => {
  render(
    <AdventureDetails
      loading
      name={exampleAdventure.name}
      description={[]}
      edition={exampleAdventure.edition}
      startingLevel={3}
      endingLevel={8}
      onNameChange={noop}
      onDescriptionChange={noop}
      onStartingLevelChange={noop}
      onEndingLevelChange={noop}
    />,
  )
  const linkElement = screen.getByText(/Loading.../i)
  expect(linkElement).toBeInTheDocument()
})
