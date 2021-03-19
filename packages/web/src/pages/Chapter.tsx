import React, { memo } from 'react'
import { Node as SlateNode } from 'slate/dist/interfaces/node'
import Layout from '../components/Layout'
import PluginEditor from '../components/PluginEditor'
import { Title } from '../components/Typography'

export const Chapter: React.FC<{
  name: string
  description: string
  body: SlateNode[]
  onSave: (text: string) => void
}> = memo(({ name, description, body, onSave }) => {
  return (
    <div>
      <Title>{name}</Title>
      <p>{description}</p>
      <div>
        <PluginEditor value={body} onSave={onSave} />
      </div>
    </div>
  )
})

const SmartChapter: React.FC = () => {
  return (
    <Layout>
      <div>TBD</div>
    </Layout>
  )
}

export default SmartChapter
