import { gql } from '@apollo/client'

const CHAPTERS_QUERY = gql`
  query GetChapterList {
    adventure {
      chapters {
        name
        slug
      }
    }
  }
`

export default CHAPTERS_QUERY
