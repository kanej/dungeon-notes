import { useStaticQuery, graphql } from 'gatsby'
import * as React from 'react'
import { Helmet } from 'react-helmet'

const Seo: React.FC<{
  title: string
  image?: string
  description?: string
  lang?: string
  meta?: { name: string; content: string }[]
}> = ({ title, image, description = '', lang = 'en', meta = [] }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            social {
              twitter
            }
          }
        }
      }
    `,
  )

  const metaDescription = description || site.siteMetadata.description
  const defaultTitle = site.siteMetadata?.title

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={
        title === 'Dungeon Notes'
          ? null
          : defaultTitle
          ? `%s | ${defaultTitle}`
          : null
      }
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          property: `og:title`,
          content: title,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:type`,
          content: `website`,
        },
        {
          name: `twitter:card`,
          content: image ? `summary` : 'summary_large_image',
        },
        {
          name: `twitter:creator`,
          content: site.siteMetadata?.social?.twitter || ``,
        },
        {
          name: `twitter:title`,
          content: title,
        },
        {
          name: `twitter:description`,
          content: metaDescription,
        },
        ...(image
          ? [
              {
                name: `twitter:image`,
                content: image,
              },
              {
                name: `og:image`,
                content: image,
              },
            ]
          : []),
      ].concat(meta)}
    />
  )
}

export default Seo
