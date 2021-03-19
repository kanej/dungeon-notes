import React, { memo } from 'react'
import PluginEditor from '../components/PluginEditor'
import Layout from '../components/Layout'
import { Title } from '../components/Typography'

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
    </div>
  )
})

const SmartChapter = () => {
  return (
    <Layout>
      <div>TBD</div>
    </Layout>
  )
}

export default SmartChapter
