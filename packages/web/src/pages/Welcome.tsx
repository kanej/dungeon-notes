import React, { memo, useCallback } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import Layout from '../components/Layout'
import { Adventure } from '../domain'
import useCreateAChapter from '../hooks/useCreateAChapter'

const ADVENTURE_QUERY = gql`
  query GetAdventureDetails {
    adventure {
      name
      edition
      description
      levels
    }
  }
`

export const Welcome: React.FC<{
  loading: boolean
  error?: string
  adventure?: Adventure
  onCreateAChapter: any
}> = memo(({ loading, error, adventure, onCreateAChapter }) => {
  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error :(</p>
  }

  const { name, edition, description, levels } = adventure!

  return (
    <div>
      <h1>{name}</h1>

      <p>
        A D &amp; D {edition}e Adventure for levels {levels}.
      </p>
      <p>{description}</p>

      <div>
        <p>This campaign has no adventures, add one to begin:</p>
        <button onClick={onCreateAChapter}>Add a chapter</button>
      </div>
    </div>
  )
})

const SmartWelcome = () => {
  const { loading, error, data } = useQuery(ADVENTURE_QUERY)

  const handleCreateAChapter = useCreateAChapter()

  return (
    <Layout>
      <Welcome
        loading={loading}
        error={error?.message}
        adventure={data?.adventure}
        onCreateAChapter={handleCreateAChapter}
      />
    </Layout>
  )
}

export default SmartWelcome
