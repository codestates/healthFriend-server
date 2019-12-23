import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    nickname: String!
    openImageChoice: String!
    levelOf3Dae: String!
    messageToFriend: String
  }

  type Query {
    hello: String!
    me: User
  }

  type Mutation {
    helloUser(name: String): String!
  }
`;

export default typeDefs;
