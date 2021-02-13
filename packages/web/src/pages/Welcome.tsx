import React, { memo, useCallback } from 'react'
import { useQuery, gql, useMutation } from '@apollo/client'
import Layout from '../components/Layout'
import { Campaign } from '../domain'

const CAMPAIGN_QUERY = gql`
  query GetCampaignDetails {
    campaign {
      name
      edition
      description
      levels
    }
  }
`

const ADD_ADVENTURE = gql`
  mutation AddAdventure($name: String!) {
    addAdventure(name: $name) {
      name
      slug
    }
  }
`

export const Welcome: React.FC<{
  loading: boolean
  error?: string
  campaign?: Campaign
  onCreateAnAdventure: any
}> = memo(({ loading, error, campaign, onCreateAnAdventure }) => {
  if (loading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>Error :(</p>
  }

  const { name, edition, description, levels } = campaign!

  return (
    <div>
      <h1>{name}</h1>

      <p>
        A D &amp; D {edition}e Adventure for levels {levels}.
      </p>
      <p>{description}</p>

      <div>
        <p>This campaign has no adventures, add one to begin:</p>
        <button onClick={onCreateAnAdventure}>Create an adventure</button>
      </div>
    </div>
  )
})

const SmartWelcome = () => {
  const { loading, error, data } = useQuery(CAMPAIGN_QUERY)
  const [
    addAdventure,
    // { loading: addAdventureLoading, error: addAdventureError },
  ] = useMutation(ADD_ADVENTURE)

  const handleCreateAnAdventure = useCallback(async () => {
    const adventure = window.prompt('What is the name of this adventure')

    if (!adventure) {
      return
    }

    return addAdventure({ variables: { name: adventure } })
  }, [addAdventure])

  return (
    <Layout>
      <Welcome
        loading={loading}
        error={error?.message}
        campaign={data?.campaign}
        onCreateAnAdventure={handleCreateAnAdventure}
      />
    </Layout>
  )
}

export default SmartWelcome