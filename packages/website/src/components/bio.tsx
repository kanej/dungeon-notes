import { useStaticQuery, graphql } from 'gatsby'
import { StaticImage } from 'gatsby-plugin-image'
import * as React from 'react'
import styled from 'styled-components'

const Bio: React.FC = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author

  return (
    <Wrap>
      <StyledImage>
        <StaticImage
          layout="fixed"
          formats={['auto', 'webp', 'avif']}
          src="../images/profile-pic.png"
          width={50}
          height={50}
          quality={95}
          alt="Profile picture"
        />
      </StyledImage>

      {author?.name && (
        <Text>
          Written by <strong>{author.name}</strong> {author?.summary || null}
          {` `}
        </Text>
      )}
    </Wrap>
  )
}

const Wrap = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
`

const StyledImage = styled.div`
  margin-right: 1rem;
  margin-bottom: 0;

  img {
    min-width: 50px;
    border-radius: 100%;
  }
`

const Text = styled.p`
  margin: 0;
`

export default Bio
