
import { gql } from 'apollo-server-express';

const registerSchema = gql`
  extend type Mutation {
    registerForTest(email: String!, password: String!): AuthPayload!
  }
`;

export { registerSchema };
