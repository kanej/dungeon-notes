/* eslint-disable new-cap */
import React, { useEffect, useMemo, useState } from 'react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, withReact } from 'slate-react'
import { useDebounce } from 'use-debounce'
import { serialize } from 'remark-slate'
import {
  FormatBold,
  FormatItalic,
  FormatQuote,
  FormatUnderlined,
  LooksOne,
  ShortText,
} from '@styled-icons/material'
import {
  withMarks,
  BalloonToolbar,
  BoldPlugin,
  BasicMarkPlugins,
  BasicElementPlugins,
  EditablePlugins,
  pipe,
  ToolbarMark,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  ItalicPlugin,
  UnderlinePlugin,
  HeadingPlugin,
  ELEMENT_H1,
  ToolbarElement,
  DEFAULTS_PARAGRAPH,
  DEFAULTS_BLOCKQUOTE,
  BlockquotePlugin,
} from '@udecode/slate-plugins'

const plugins = [
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  HeadingPlugin(),
  BlockquotePlugin(),
  BasicMarkPlugins(),
  BasicElementPlugins(),
]

const withPlugins = [withReact, withHistory, withMarks()] as const

function mapType(v: any) {
  if (v.type === 'h1') {
    return { ...v, type: 'heading_one' }
  }

  if (v.type === 'h2') {
    return { ...v, type: 'heading_two' }
  }

  if (v.type === 'blockquote') {
    return { ...v, type: 'block_quote' }
  }

  return v
}

function unmapType(v: any) {
  if (v.type === 'heading_one') {
    return { ...v, type: 'h1' }
  }

  if (v.type === 'heading_two') {
    return { ...v, type: 'h2' }
  }

  if (v.type === 'block_quote') {
    return { ...v, type: 'blockquote' }
  }

  return v
}

export const Editor: React.FC<{
  value: Array<any>
  onSave: (text: string) => void
}> = ({ value: initialValue, onSave }) => {
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), [])

  const [value, setValue] = useState<any>(() =>
    initialValue
      ? initialValue.map(unmapType)
      : [
          {
            type: 'paragraph',
            children: [{ text: 'Start your adventure! NO really ...' }],
          },
        ],
  )

  const [snapshot] = useDebounce(value, 3000)

  useEffect(() => {
    const markdown = snapshot.map((v: any) => serialize(mapType(v))).join('')

    onSave(markdown)
  }, [onSave, snapshot])

  return (
    <Slate
      editor={editor}
      value={value}
      onChange={(newValue) => setValue(newValue)}
    >
      <BalloonToolbar arrow>
        <ToolbarMark
          reversed
          type={MARK_BOLD}
          icon={<FormatBold />}
          tooltip={{ content: 'Bold (⌘B)' }}
        />
        <ToolbarMark
          reversed
          type={MARK_ITALIC}
          icon={<FormatItalic />}
          tooltip={{ content: 'Italic (⌘I)' }}
        />
        <ToolbarMark
          reversed
          type={MARK_UNDERLINE}
          icon={<FormatUnderlined />}
          tooltip={{ content: 'Underline (⌘U)' }}
        />
        <ToolbarElement
          reversed
          type={DEFAULTS_PARAGRAPH.p.type!}
          icon={<ShortText />}
          tooltip={{ content: 'Paragraph' }}
        />
        <ToolbarElement
          reversed
          type={DEFAULTS_BLOCKQUOTE.blockquote.type!}
          icon={<FormatQuote />}
          tooltip={{ content: 'Blockquote' }}
        />
        <ToolbarElement
          reversed
          type={ELEMENT_H1}
          icon={<LooksOne />}
          tooltip={{ content: 'Heading' }}
        />
      </BalloonToolbar>
      <EditablePlugins plugins={plugins} placeholder="Enter some text..." />
    </Slate>
  )
}

export default Editor
