import { gql } from 'apollo-server-express'

const schema = gql`
  type Query {
    campaign: Campaign
  }

  type Mutation {
    addAdventure(name: String!): AdventureDescription!
  }

  type Campaign {
    name: String!
    edition: Int!
    levels: String!
    description: String!
    adventures: [AdventureDescription]
  }

  type AdventureDescription {
    name: String!
    slug: String!
  }
`

export default schema
