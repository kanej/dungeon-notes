import { generate } from '@dungeon-notes/name-generator'
import { ContentCopy } from '@styled-icons/material/ContentCopy'
import { Refresh } from '@styled-icons/material/Refresh'
import { PageProps, graphql } from 'gatsby'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

import Layout from '../../components/layout'
import Seo from '../../components/seo'
import { theme as styleTheme } from '../../theme'
import { assertNever } from '../../utils/assertNever'

type DataProps = {
  site: {
    siteMetadata?: {
      title: string
    }
  }
}

type CopyState = 'ready' | 'error' | 'success'

const NameGenerator: React.FC<PageProps<DataProps>> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [copyState, setCopyState] = useState<CopyState>('ready')

  const copyTooltip = useMemo(() => {
    switch (copyState) {
      case 'ready':
        return 'Copy name to clipboard'
      case 'success':
        return 'Copied!'
      case 'error':
        return 'Copy failed!'
      default:
        assertNever(copyState)
    }
  }, [copyState])

  const handleRefresh = useCallback(() => {
    setName(generate())
    setLoading(false)
  }, [])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(name)

      setCopyState('success')
    } catch (error) {
      setCopyState('error')
    } finally {
      setTimeout(() => setCopyState('ready'), 1000)
    }
  }, [name])

  useEffect(() => {
    setName(generate())
    setLoading(false)
  }, [])

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Name Generator" />

      <Wrap>
        {!loading && (
          <Panel>
            <ActionRow>
              <div />
              <ActionButton
                data-tip
                type="reset"
                data-for="roll-again"
                data-state="ready"
                onClick={handleRefresh}
              >
                <Refresh />
              </ActionButton>
              <ReactTooltip
                id="roll-again"
                place="right"
                type="dark"
                effect="solid"
                delayShow={500}
              >
                <span>Roll again</span>
              </ReactTooltip>
            </ActionRow>
            <Name>{name}</Name>
            <ActionRow>
              <div />
              <ActionButton
                data-tip
                type="button"
                data-for="copy"
                data-state={copyState}
                onClick={handleCopy}
              >
                <ContentCopy />
              </ActionButton>
              <ReactTooltip
                id="copy"
                place="right"
                type="dark"
                effect="solid"
                delayShow={500}
              >
                <span>{copyTooltip}</span>
              </ReactTooltip>
            </ActionRow>
          </Panel>
        )}
      </Wrap>
    </Layout>
  )
}

const Wrap = styled.div`
  display: grid;
  height: 100%;
  place-items: center;
`

const Panel = styled.div`
  display: grid;
`

const ActionRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
`

const Name = styled.p`
  font-size: 4rem;
  color: ${({ theme }) => theme.text.color};
  padding: 0rem 2rem;
  text-align: center;
`

const ActionButton = styled.button`
  background: none;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;

  color: ${({ theme }) => theme.text.primary};

  &:hover {
    background-color: ${({
      theme,
      'data-state': state,
    }: {
      theme: typeof styleTheme
      'data-state': CopyState
    }) => (state === 'success' ? 'green' : theme.text.primary)};
    color: ${({ theme }) => theme.background.color};
    transition: all 0.4s;
  }
`

export default NameGenerator

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
