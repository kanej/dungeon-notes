import { generate } from '@dungeon-notes/name-generator'
import { Refresh } from '@styled-icons/material/Refresh'
import { PageProps, graphql } from 'gatsby'
import React, { useState, useEffect, useCallback } from 'react'
import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

import Layout from '../../components/layout'
import Seo from '../../components/seo'

type DataProps = {
  site: {
    siteMetadata?: {
      title: string
    }
  }
}

const NameGenerator: React.FC<PageProps<DataProps>> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')

  const handleRefresh = useCallback(() => {
    setName(generate())
    setLoading(false)
  }, [])

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
              <RefreshButton
                data-tip
                type="reset"
                data-for="roll-again"
                onClick={handleRefresh}
              >
                <Refresh />
              </RefreshButton>
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

const RefreshButton = styled.button`
  background: none;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;

  color: ${({ theme }) => theme.text.primary};

  &:hover {
    background-color: ${({ theme }) => theme.text.primary};
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
