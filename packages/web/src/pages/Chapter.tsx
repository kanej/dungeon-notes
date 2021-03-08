import { gql, useMutation, useQuery } from '@apollo/client'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import unified from 'unified'
import markdown from 'remark-parse'
import slate from 'remark-slate'
import PluginEditor from '../components/PluginEditor'
import Layout from '../components/Layout'
import { Title } from '../components/Typography'

const CHAPTER_QUERY = gql`
  query GetChapterDetails($slug: String!) {
    chapter(slug: $slug) {
      name
      slug
      description
      body
    }
  }
`

const UPDATE_CHAPTER_BODY = gql`
  mutation UpdateChapterBody($slug: String!, $body: String!) {
    updateChapterBody(slug: $slug, body: $body)
  }
`

const markdownToSlateConvertor = unified().use(markdown).use(slate)

export const Chapter: React.FC<{
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
        <PluginEditor value={body} onSave={onSave} />
      </div>
      {/* <div>
        <Editor value={body} onSave={onSave} />
      </div> */}
    </div>
  )
})

const SmartChapter = () => {
  const { chapter: chapterSlug } = useParams<{ chapter: string }>()

  const { loading, error, data } = useQuery(CHAPTER_QUERY, {
    variables: { slug: chapterSlug },
  })

  const [updateChapterBody] = useMutation(UPDATE_CHAPTER_BODY)

  const [slateInitialState, setSlateInitialState] = useState<any | null>(null)

  const handleSave = useCallback(
    (text: string) => {
      return updateChapterBody({
        variables: { slug: chapterSlug, body: text },
      })
    },
    [chapterSlug, updateChapterBody],
  )

  useEffect(() => {
    let mounted = true
    if (!data) {
      setSlateInitialState(null)
      return () => {}
    }

    const convert = async () => {
      const slateState = await markdownToSlateConvertor.process(
        data.chapter.body,
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
    chapter: { name, description },
  } = data

  return (
    <Layout>
      <Chapter
        name={name}
        description={description}
        body={slateInitialState}
        onSave={handleSave}
      />
    </Layout>
  )
}

export default SmartChapter
