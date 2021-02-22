import React, { useMemo, useState } from 'react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Slate, withReact } from 'slate-react'
import {
  FormatBold,
  FormatItalic,
  FormatUnderlined,
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
} from '@udecode/slate-plugins'

const plugins = [
  BoldPlugin(),
  ItalicPlugin(),
  UnderlinePlugin(),
  BasicMarkPlugins(),
  BasicElementPlugins(),
]

const withPlugins = [withReact, withHistory, withMarks()] as const

export const Editor: React.FC<{
  value: string
  onSave: (text: string) => void
}> = ({ value: initialValue, onSave }) => {
  const editor = useMemo(() => pipe(createEditor(), ...withPlugins), [])
  const [value, setValue] = useState<any>(
    initialValue || [
      {
        type: 'paragraph',
        children: [{ text: 'Start your adventure! NO really ...' }],
      },
    ],
  )

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
      </BalloonToolbar>
      <EditablePlugins plugins={plugins} placeholder="Enter some text..." />
    </Slate>
  )
}

export default Editor
