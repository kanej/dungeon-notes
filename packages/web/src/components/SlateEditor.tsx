import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createEditor, Editor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'
import { useDebounce } from 'use-debounce'
import { serialize } from 'remark-slate'
import isHotkey from 'is-hotkey'

const SlateEditor: React.FC<{
  value: string
  onSave: (text: string) => void
}> = ({ value: initialValue, onSave }) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const renderElement = useCallback((props: any) => <Element {...props} />, [])
  const renderLeaf = useCallback((props) => <Leaf {...props} />, [])

  const [value, setValue] = useState<any>(
    initialValue || [
      {
        type: 'paragraph',
        children: [{ text: 'Start your adventure! NO really ...' }],
      },
    ],
  )

  const handleChange = useCallback((newValue) => {
    setValue(newValue)
  }, [])

  const handleShortcuts = useCallback(
    (e) => {
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

    onSave(markdown)
  }, [onSave, snapshot])

  return (
    <div>
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
    </div>
  )
}

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

export default SlateEditor
