import { gql, useMutation, useQuery } from '@apollo/client'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import unified from 'unified'
import markdown from 'remark-parse'
import slate from 'remark-slate'
import Editor from '../components/SlateEditor'
import Layout from '../components/Layout'
import { Title } from '../components/Typography'

const ADVENTURE_QUERY = gql`
  query GetAdventureDetails($slug: String!) {
    adventure(slug: $slug) {
      name
      slug
      description
      body
    }
  }
`

const UPDATE_ADVENTURE_BODY = gql`
  mutation UpdateAdventureBody($slug: String!, $body: String!) {
    updateAdventureBody(slug: $slug, body: $body)
  }
`

const markdownToSlateConvertor = unified().use(markdown).use(slate)

export const Adventure: React.FC<{
  name: string
  description: string
  body: any
  onSave: (text: string) => void
}> = memo(({ name, description, body, onSave }) => {
  return (
    <div>
      <Title>{name}</Title>
      <p>{description}</p>
      <div>
        <Editor value={body} onSave={onSave} />
      </div>
    </div>
  )
})

const SmartAdventure = () => {
  const { adventure: adventureSlug } = useParams<{ adventure: string }>()

  const { loading, error, data } = useQuery(ADVENTURE_QUERY, {
    variables: { slug: adventureSlug },
  })

  const [
    updateAdventureBody,
    // { loading: addAdventureLoading, error: addAdventureError },
  ] = useMutation(UPDATE_ADVENTURE_BODY)

  const [slateInitialState, setSlateInitialState] = useState<any | null>(null)

  const handleSave = useCallback(
    (text: string) => {
      return updateAdventureBody({
        variables: { slug: adventureSlug, body: text },
      })
    },
    [adventureSlug, updateAdventureBody],
  )

  useEffect(() => {
    let mounted = true
    if (!data) {
      setSlateInitialState(null)
      return () => {}
    }

    const convert = async () => {
      const slateState = await markdownToSlateConvertor.process(
        data.adventure.body,
      )

      if (!mounted) {
        return
      }

      setSlateInitialState(slateState.result)
    }

    convert()

    return () => (mounted = false)
  }, [data])

  if (loading || !slateInitialState) {
    return (
      <Layout>
        <div>Loading...</div>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <div>{error}</div>
      </Layout>
    )
  }

  const {
    adventure: { name, description },
  } = data

  return (
    <Layout>
      <Adventure
        name={name}
        description={description}
        body={slateInitialState}
        onSave={handleSave}
      />
    </Layout>
  )
}

export default SmartAdventure
