import { PageProps, Link, graphql } from 'gatsby'
import { GatsbyImage, getImage, ImageDataLike } from 'gatsby-plugin-image'
import * as React from 'react'
import styled from 'styled-components'

import Bio from '../components/bio'
import Layout from '../components/layout'
import Seo from '../components/seo'

type DataProps = {
  site: {
    siteMetadata?: {
      title: string
    }
  }
  markdownRemark: {
    frontmatter: {
      title: string
      description: string
      date: string
      featuredImage?: {
        path: ImageDataLike
        alt: string
        credit: string
        link: string
      }
    }
    fields: { slug: string }
    excerpt: string
    html: string
  }
  previous: {
    frontmatter: { title: string }
    fields: { slug: string }
  }
  next: {
    frontmatter: { title: string }
    fields: { slug: string }
  }
}

const FeaturedImage: React.FC<{
  featuredImage?: {
    path: ImageDataLike
    alt: string
    credit: string
    link: string
  }
}> = ({ featuredImage }) => {
  if (!featuredImage) {
    return <div />
  }

  const { path, credit, alt, link } = featuredImage

  const image = getImage(path)

  return (
    <ImageContainer>
      <GatsbyImage image={image} alt={alt} />
      <CreditText>
        Photo by <a href={link}>{credit}</a> on{' '}
        <a href="https://unsplash.com/s/photos/witch?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
          Unsplash
        </a>
      </CreditText>
    </ImageContainer>
  )
}

const BlogPostTemplate: React.FC<PageProps<DataProps>> = ({
  data,
  location,
}) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const featuredImage = data.markdownRemark.frontmatter?.featuredImage
  const { previous, next } = data

  return (
    <Layout location={location} title={siteTitle}>
      <Seo
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <Wrap>
        <article itemScope itemType="http://schema.org/Article">
          <Header>
            <Headline>{post.frontmatter.title}</Headline>
            <small>{post.frontmatter.date}</small>
          </Header>
          <FeaturedImage featuredImage={featuredImage} />
          <Section
            dangerouslySetInnerHTML={{ __html: post.html }}
            itemProp="articleBody"
          />
          <hr />
          <footer>
            <Bio />
          </footer>
        </article>
        <nav className="blog-post-nav">
          <ul
            style={{
              display: `flex`,
              flexWrap: `wrap`,
              justifyContent: `space-between`,
              listStyle: `none`,
              padding: 0,
            }}
          >
            <li>
              {previous && (
                <Link to={`/blog${previous.fields.slug}`} rel="prev">
                  ← {previous.frontmatter.title}
                </Link>
              )}
            </li>
            <li>
              {next && (
                <Link to={`/blog${next.fields.slug}`} rel="next">
                  {next.frontmatter.title} →
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </Wrap>
    </Layout>
  )
}

const Wrap = styled.div`
  @media (max-width: 575px) {
    padding-left: 1rem;
    padding-right: 1rem;
  }
`

const Header = styled.header`
  margin-bottom: 1rem;
`

const Headline = styled.h1`
  margin: 0 0;
`

const Section = styled.section`
  img {
    width: 100%;
    max-width: 100%;
  }

  .gatsby-highlight {
    overflow-x: scroll;
    max-width: 90vw;
  }

  blockquote {
    margin-right: 0;
  }
`

const ImageContainer = styled.div``

const CreditText = styled.p`
  color: gray;
  margin-bottom: 2rem;
`

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        featuredImage {
          path {
            childImageSharp {
              gatsbyImageData(
                layout: CONSTRAINED
                placeholder: BLURRED
                formats: [AUTO, WEBP, AVIF]
              )
            }
          }
          alt
          credit
          link
        }
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
