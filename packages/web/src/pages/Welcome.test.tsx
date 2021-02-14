import React from 'react'
import { render, screen } from '@testing-library/react'
import { Welcome } from './Welcome'
import { Adventure } from '../domain'

test('Renders loading', () => {
  render(<Welcome loading={true} onCreateAChapter={undefined} />)
  const linkElement = screen.getByText(/Loading.../i)
  expect(linkElement).toBeInTheDocument()
})

test('Renders error', () => {
  render(
    <Welcome loading={false} error={'Fail'} onCreateAChapter={undefined} />,
  )
  const linkElement = screen.getByText(/Error :\(/i)
  expect(linkElement).toBeInTheDocument()
})

test('Renders layout after load', () => {
  const exampleAdventure: Adventure = {
    name: 'Dungeon of Doom',
    description: 'Fun in a dungeon',
    edition: '5',
    levels: '3-10',
  }

  render(
    <Welcome
      loading={false}
      adventure={exampleAdventure}
      onCreateAChapter={undefined}
    />,
  )

  const titleElement = screen.getByText(/Dungeon of Doom/i)
  expect(titleElement).toBeInTheDocument()

  const descriptionElement = screen.getByText(/Fun in a dungeon/i)
  expect(descriptionElement).toBeInTheDocument()

  const infoElement = screen.getByText(/A D & D 5e Adventure for levels 3-10/i)
  expect(infoElement).toBeInTheDocument()
})
