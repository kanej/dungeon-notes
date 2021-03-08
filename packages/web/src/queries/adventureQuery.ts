import { gql } from '@apollo/client'

const ADVENTURE_QUERY = gql`
  query GetAdventureDetails {
    adventure {
      name
      edition
      description
      levels
    }
  }
`

export default ADVENTURE_QUERY
