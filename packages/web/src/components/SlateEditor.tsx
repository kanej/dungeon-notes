import React, {
  PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  createEditor,
  Editor,
  Range,
  Transforms,
  Element as SlateElement,
} from 'slate'
import { Slate, Editable, withReact, useSlate, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'
import { useDebounce } from 'use-debounce'
import { serialize } from 'remark-slate'
import isHotkey from 'is-hotkey'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { BlockQuote, Heading1, Heading2, Paragraph } from './Typography'

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
        <HoveringToolbar />
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

const isBlockActive = (editor: Editor, format: string) => {
  const [match] = Editor.nodes(editor, {
    match: (n) =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
  })

  return Boolean(match)
}

const toggleMark = (editor: Editor, format: string) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const LIST_TYPES = ['numbered_list', 'bulleted_list']

const toggleBlock = (editor: Editor, format: string) => {
  const isActive = isBlockActive(editor, format)
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: (n) =>
      LIST_TYPES.includes(
        // @ts-ignore
        (!Editor.isEditor(n) && SlateElement.isElement(n) && n.type) || '',
      ),
    split: true,
  })
  const newProperties: Partial<SlateElement> = {
    type: isActive ? 'paragraph' : isList ? 'list-item' : format,
  }
  Transforms.setNodes(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const Element = ({ attributes, children, element }: any) => {
  switch (element.type) {
    case 'heading_one':
      return <Heading1 {...attributes}>{children}</Heading1>
    case 'heading_two':
      return <Heading2 {...attributes}>{children}</Heading2>
    case 'block_quote':
      return <BlockQuote {...attributes}>{children}</BlockQuote>
    case 'bulleted_list':
      return <ul {...attributes}>{children}</ul>
    case 'numbered_list':
      return <ol {...attributes}>{children}</ol>
    case 'paragraph':
      return <Paragraph {...attributes}>{children}</Paragraph>
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

const HoveringToolbar = () => {
  const ref = useRef<HTMLDivElement | null>()
  const editor = useSlate()

  useEffect(() => {
    const el = ref.current
    const { selection } = editor

    if (!el) {
      return
    }

    if (
      !selection ||
      !ReactEditor.isFocused(editor) ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.removeAttribute('style')
      return
    }

    const domSelection = window.getSelection()

    if (!domSelection) {
      return
    }

    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()
    console.log(rect)
    el.style.opacity = '1'
    el.style.top = `${rect.top + window.pageYOffset - el.offsetHeight}px`
    el.style.left = `${
      rect.left + window.pageXOffset - el.offsetWidth / 2 + rect.width / 2
    }px`

    console.log(el)
  })

  return (
    <Portal>
      <StyledMenu ref={ref} className="popup-menu">
        <FormatButton format="bold" icon="format_bold" />
        <FormatButton format="italic" icon="format_italic" />
        <FormatButton format="underlined" icon="format_underlined" />
        <BlockButton format="heading_one" icon="looks_one" />
        <BlockButton format="heading_two" icon="looks_two" />
        <BlockButton format="paragraph" icon="paragraph" />
        <BlockButton format="block_quote" icon="format_quote" />
        <BlockButton format="numbered_list" icon="format_list_numbered" />
        <BlockButton format="bulleted_list" icon="format_list_bulleted" />
      </StyledMenu>
    </Portal>
  )
}

const FormatButton = ({ format }: any) => {
  const editor = useSlate()

  return (
    <div>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault()
          toggleMark(editor, format)
        }}
      >
        {format}
      </button>
    </div>
  )
}

const BlockButton = ({ format }: any) => {
  const editor = useSlate()

  return (
    <div>
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault()
          toggleBlock(editor, format)
        }}
      >
        {format}
      </button>
    </div>
  )
}

interface BaseProps {
  className: string
  [key: string]: unknown
}

export const Menu = React.forwardRef(
  ({ className, ...props }: PropsWithChildren<BaseProps>, ref: any) => (
    <div {...props} ref={ref} className={className} />
  ),
)

const StyledMenu = styled(Menu)`
  padding: 8px 7px 6px;
  position: absolute;
  z-index: 1;
  border: 3px solid red;
  top: -10000px;
  left: -10000px;
  margin-top: -6px;
  opacity: 0;
  background-color: #222;
  border-radius: 4px;
  transition: opacity 0.75s;

  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }

  background: blue;
`

const Portal = ({ children }: any) => {
  return ReactDOM.createPortal(children, document.body)
}

export default SlateEditor
