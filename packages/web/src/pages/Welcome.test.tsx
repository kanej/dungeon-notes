import React from 'react'
import { render, screen } from '@testing-library/react'

import { Adventure } from '../domain'
import AdventureDetails from '../components/AdventureDetails'

const exampleAdventure: Adventure = {
  name: 'Dungeon of Doom',
  version: '0.1',
  description: 'Fun in a dungeon',
  levels: '3-8',
  edition: 5,
  chapters: [],
}

test('Renders loading', () => {
  render(
    <AdventureDetails
      loading
      name={exampleAdventure.name}
      description={[]}
      edition={exampleAdventure.edition}
      startingLevel={3}
      endingLevel={8}
      onNameChange={() => {}}
      onDescriptionChange={() => {}}
      onStartingLevelChange={() => {}}
      onEndingLevelChange={() => {}}
    />,
  )
  const linkElement = screen.getByText(/Loading.../i)
  expect(linkElement).toBeInTheDocument()
})
