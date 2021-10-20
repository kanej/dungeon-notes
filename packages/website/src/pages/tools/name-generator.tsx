import * as React from 'react'
import { PageProps, Link, graphql } from 'gatsby'
import styled from 'styled-components'
import { generate } from '@dungeon-notes/name-generator'

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

  const name = React.useMemo(() => generate(), [])

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Name Generator" />

      <Wrap>
        <Name>{name}</Name>
      </Wrap>
    </Layout>
  )
}

const Wrap = styled.div`
  display: grid;
  height: 100%;
  place-items: center;
`

const Name = styled.p`
  font-size: 4rem;
  color: ${({ theme }) => theme.text.color};
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
