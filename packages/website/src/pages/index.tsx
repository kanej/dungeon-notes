import { PageProps, Link, graphql } from 'gatsby'
import * as React from 'react'
import styled from 'styled-components'

import Layout from '../components/layout'
import Seo from '../components/seo'

type DataProps = {
  site: {
    siteMetadata?: {
      title: string
    }
  }
}

const BlogIndex: React.FC<PageProps<DataProps>> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="All posts" />
      <IntroText>
        Dungeon Notes provides tools to help Dungeon Masters plan and improvise
        their game sessions.
      </IntroText>

      <Wrap>
        <div>
          <Text>What would you have me do, wise Dungeon Master?</Text>
          <ButtonList>
            <Button to="/tools/name-generator">Summon a name!</Button>
          </ButtonList>
        </div>
      </Wrap>
    </Layout>
  )
}

const Wrap = styled.div`
  display: grid;
  margin-top: 4rem;
`

const IntroText = styled.p`
  font-size: 1.2rem;
`

const Text = styled.p`
  font-size: 1.7rem;
  font-weight: bold;
  font-family: 'Alte Schwabacher';
`

const ButtonList = styled.div`
  display: grid;
  place-items: center;
`

const Button = styled(Link)`
  text-decoration: none;
  border: 1px solid #bb0808;
  padding: 1rem;

  &:hover {
    background: #bb0808;
    color: white;

    transition: 0.5s all;
  }
`

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
