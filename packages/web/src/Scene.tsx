import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  createEditor,
  Transforms,
  Node,
  Element as SlateElement,
  Editor,
} from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { useDebounce } from 'use-debounce'
import { serialize } from 'remark-slate'
import styled from 'styled-components'
import isHotkey from 'is-hotkey'

const isMarkActive = (editor: Editor, format: string) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const withLayout = (editor: Editor) => {
  const { normalizeNode } = editor

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length < 1) {
        const title = { type: 'heading_one', children: [{ text: 'Untitled' }] }
        Transforms.insertNodes(editor, title, { at: path.concat(0) })
      }

      if (editor.children.length < 2) {
        const paragraph = { type: 'paragraph', children: [{ text: '' }] }
        Transforms.insertNodes(editor, paragraph, { at: path.concat(1) })
      }

      for (const [child, childPath] of Node.children(editor, path)) {
        const type = childPath[0] === 0 ? 'heading_one' : 'paragraph'

        if (SlateElement.isElement(child) && child.type !== type) {
          const newProperties: Partial<SlateElement> = { type }
          Transforms.setNodes(editor, newProperties, { at: childPath })
        }
      }
    }

    return normalizeNode([node, path])
  }

  return editor
}

function Scene({ initialDoc = undefined }: { initialDoc: any | undefined }) {
  const editor = useMemo(
    () => withLayout(withHistory(withReact(createEditor()))),
    [],
  )
  const renderElement = useCallback((props: any) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])
  const [value, setValue] = useState<any>(
    initialDoc || [
      {
        type: 'heading_one',
        children: [{ text: 'Name your scene...' }],
      },
      {
        type: 'paragraph',
        children: [{ text: 'Provide an introductions' }],
      },
    ],
  )

  const handleChange = useCallback((newValue) => {
    setValue(newValue)
  }, [])

  const handleShortcuts = useCallback(
    (e) => {
      console.log('here')
      if (isHotkey('mod+b', e)) {
        e.preventDefault()
        toggleMark(editor, 'bold')
      }
      if (isHotkey('mod+i', e)) {
        e.preventDefault()
        toggleMark(editor, 'italic')
      }
      if (isHotkey('mod+u', e)) {
        e.preventDefault()
        toggleMark(editor, 'underline')
      }
    },
    [editor],
  )

  const [snapshot] = useDebounce(value, 3000)

  useEffect(() => {
    const markdown = snapshot.map((v: any) => serialize(v)).join('')

    const postToServer = async () => {
      await fetch('/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: markdown,
      })
    }

    postToServer()
  }, [snapshot])

  return (
    <div>
      <Main>
        <Slate
          // @ts-ignore
          editor={editor}
          value={value}
          onChange={handleChange}
        >
          <Editable
            autoFocus
            spellCheck
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            onKeyDown={handleShortcuts}
          />
        </Slate>
      </Main>
    </div>
  )
}

const Element = ({ attributes, children, element }: any) => {
  switch (element.type) {
    case 'heading_one':
      return <h2 {...attributes}>{children}</h2>
    case 'paragraph':
      return <p {...attributes}>{children}</p>
    default:
      return <div {...attributes}>{children}</div>
  }
}

const Leaf = ({ attributes, children, leaf }: any) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const Main = styled.main`
  // font-family: 'MedievalSharp', cursive;
  margin: 2rem;
`

export default Scene
