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
  allMarkdownRemark: {
    nodes: {
      frontmatter: { title: string; description: string; date: string }
      fields: { slug: string }
      excerpt: string
    }[]
  }
}

const ChangelogIndex: React.FC<PageProps<DataProps>> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="Changelog" />
        <p>No changelog posts found.</p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Changelog" />
      <Wrap>
        <ol style={{ listStyle: `none` }}>
          {posts.map((post) => {
            const title = post.frontmatter.title || post.fields.slug

            return (
              <li key={post.fields.slug}>
                <Article itemScope itemType="http://schema.org/Article">
                  <header>
                    <h2>
                      <Link to={`/changelog${post.fields.slug}`} itemProp="url">
                        <span itemProp="headline">{title}</span>
                      </Link>
                    </h2>
                    <small>{post.frontmatter.date}</small>
                  </header>
                  <section>
                    <p
                      // eslint-disable-next-line react/no-danger
                      dangerouslySetInnerHTML={{
                        __html: post.frontmatter.description || post.excerpt,
                      }}
                      itemProp="description"
                    />
                  </section>
                </Article>
              </li>
            )
          })}
        </ol>
      </Wrap>
    </Layout>
  )
}

const Wrap = styled.div`
  @media (max-width: 575px) {
    padding-left: 1.2rem;
    padding-right: 1.2rem;
  }
`

const Article = styled.article`
  max-width: ${({ theme }) => theme.spacing.maxWidth};
`

export default ChangelogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
