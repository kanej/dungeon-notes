import {
  Chapter as ChapterType,
  GUID,
  updateChapterName,
} from '@dungeon-notes/types'
import { updateChapterBody } from '@dungeon-notes/types/dist/redux/slices/adventureSlice'
import React, {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import markdown from 'remark-parse'
import slate from 'remark-slate'
import { Node as SlateNode } from 'slate/dist/interfaces/node'
import styled from 'styled-components'
import unified from 'unified'
import Layout from '../components/Layout'
import PluginEditor from '../components/PluginEditor'
import { MAX_CHAPTER_NAME_LENGTH } from '../constants'
import useDebounce from '../hooks/useDebounce'
import { RootState } from '../redux/rootReducer'
import { LoadingStates } from '../redux/slices/loadingSlice'

const markdownToSlateConvertor = unified().use(markdown).use(slate)

const blankSlate = [{ type: 'paragraph', children: [{ text: '' }] }]

const Chapter: React.FC<{
  name: string
  body: SlateNode[]
  onNameChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSave: (text: string) => void
}> = memo(({ name, body, onNameChange, onSave }) => {
  return (
    <div>
      <form>
        <NameInput
          type="text"
          maxLength={MAX_CHAPTER_NAME_LENGTH}
          value={name}
          onChange={onNameChange}
        />
      </form>
      <div>
        <PluginEditor value={body} onSave={onSave} />
      </div>
    </div>
  )
})

const SmartChapter: React.FC = () => {
  const { chapterId } = useParams<{ chapterId?: GUID }>()
  const dispatch = useDispatch()

  if (!chapterId) {
    throw new Error('Could not find chapter id')
  }

  const {
    loading: chapterLoading,
    chapter,
  }: { loading: boolean; chapter: ChapterType } = useSelector(
    (state: RootState) => ({
      loading: state.loading.state !== LoadingStates.COMPLETE,
      chapter: state.adventure.chapterMap[chapterId],
    }),
  )

  const [loading, setLoading] = useState(true)

  const [chapterName, setChapterName] = useState('')
  const onChapterNameChange = useCallback(
    (ev) => setChapterName(ev.target.value),
    [],
  )

  const [chapterBody, setChapterBody] = useState<string | null>(null)
  const onChapterBodyChange = useCallback((body) => {
    setChapterBody(body)
  }, [])

  const [slateInitialState, setSlateInitialState] = useState<SlateNode[]>(
    blankSlate,
  )

  useEffect(() => {
    if (chapterLoading || !chapter) {
      return
    }

    let mounted = true

    const loadChapter = async () => {
      if (!mounted) {
        return
      }

      setChapterName(chapter.name)

      const slateState = await markdownToSlateConvertor.process(chapter.body)

      setChapterBody(chapter.body)
      setSlateInitialState(slateState.result as SlateNode[])
      setLoading(false)
    }

    loadChapter()

    return () => {
      mounted = false
    }
  }, [chapter, chapterLoading])

  const debouncedChapterName = useDebounce(chapterName, 2000)

  useEffect(() => {
    if (loading) {
      return
    }

    let mounted = true

    const runUpdateName = async () => {
      if (!mounted) {
        return
      }

      if (debouncedChapterName.length <= 4) {
        return
      }

      const command = updateChapterName({
        id: chapterId,
        name: debouncedChapterName,
      })

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
  }, [chapterId, debouncedChapterName, dispatch, loading])

  const debouncedChapterBody = useDebounce(chapterBody, 2000)

  useEffect(() => {
    if (loading) {
      return
    }

    let mounted = true

    const runUpdateBody = async () => {
      if (!mounted || debouncedChapterBody === null) {
        return
      }

      const command = updateChapterBody({
        id: chapterId,
        body: debouncedChapterBody,
      })

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

    runUpdateBody()

    return () => {
      mounted = false
    }
  }, [chapterId, debouncedChapterBody, debouncedChapterName, dispatch, loading])

  if (loading || !slateInitialState) {
    return (
      <Layout>
        <div>Loading ...</div>
      </Layout>
    )
  }

  return (
    <Layout>
      <Chapter
        name={chapterName}
        body={slateInitialState}
        onNameChange={onChapterNameChange}
        onSave={onChapterBodyChange}
      />
    </Layout>
  )
}

const NameInput = styled.input`
  width: 100%;

  background: none;
  border: none;
  outline: none;
  font-size: 24px;

  border-bottom: 1px solid lightgray;
`

export default SmartChapter
