import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    user(userId: String): User
    users: [User]!
  }
`;

export default typeDefs;
