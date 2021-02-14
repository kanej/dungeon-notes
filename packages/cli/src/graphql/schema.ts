import { gql } from 'apollo-server-express'

const schema = gql`
  type Query {
    adventure: Adventure
    chapter(slug: String!): Chapter
  }

  type Mutation {
    addChapter(name: String!): ChaptureDescription!
    updateChapterBody(slug: String!, body: String!): Boolean
  }

  type Adventure {
    name: String!
    edition: Int!
    levels: String!
    description: String!
    chapters: [ChaptureDescription!]!
  }

  type ChaptureDescription {
    name: String!
    slug: String!
  }

  type Chapter {
    name: String!
    slug: String!
    description: String!
    body: String!
  }
`

export default schema
