import { gql } from 'apollo-server-express'

const schema = gql`
  type Query {
    campaign: Campaign
    adventure(slug: String!): Adventure
  }

  type Mutation {
    addAdventure(name: String!): AdventureDescription!
    updateAdventureBody(slug: String!, body: String!): Boolean
  }

  type Campaign {
    name: String!
    edition: Int!
    levels: String!
    description: String!
    adventures: [AdventureDescription!]!
  }

  type AdventureDescription {
    name: String!
    slug: String!
  }

  type Adventure {
    name: String!
    slug: String!
    description: String!
    body: String!
  }
`

export default schema
