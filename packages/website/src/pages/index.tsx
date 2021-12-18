import { PageProps, Link, graphql } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
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

const ChangelogIndex: React.FC<PageProps<DataProps>> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Dungeon Notes" />
      <IntroText>
        Dungeon Notes provides tools to help Dungeon Masters plan and improvise
        their game sessions.
      </IntroText>

      <Wrap>
        <div>
          <Text>What would you have me do, Dungeon Master?</Text>
          <ButtonList>
            <Button to="/tools/name-generator">Summon a name!</Button>
          </ButtonList>
        </div>
      </Wrap>

      <BookWrap>
        <StaticImage
          src="../images/codex_sorcery.png"
          alt="A damned spellbook"
          placeholder="dominantColor"
          width={300}
        />
      </BookWrap>
    </Layout>
  )
}

const Wrap = styled.div`
  display: grid;
  margin-top: 3rem;

  @media (max-width: 575px) {
    padding-left: 1.2rem;
    padding-right: 1.2rem;
  }
`

const IntroText = styled.p`
  font-size: 1.2rem;

  @media (max-width: 575px) {
    padding-left: 1.2rem;
    padding-right: 1.2rem;
  }
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

const BookWrap = styled.div`
  width: 100%;
  display: grid;
  place-items: center;
  margin-top: 4rem;
`

export default ChangelogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
