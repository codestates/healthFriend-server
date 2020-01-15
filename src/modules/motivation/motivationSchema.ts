import { gql } from 'apollo-server-express';

const motivationSchema = gql`
  type Motivation {
    id: ID!
    motivation: String!
    owner: User!
  }
`;

export { motivationSchema };
