import { gql } from 'apollo-server-express';

const followSchema = gql`
  type Follow {
    id: ID!
    following: User!
    follower: User!
    checked: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;

export { followSchema };
