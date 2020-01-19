import { gql } from 'apollo-server-express';

const friendsSchema = gql`
  type Friends {
    id: ID!
    me: User!
    friend: User!
    checked: Boolean!
    createdAt: DateTime!
    updatedAt: DateTime!
  }
`;

export { friendsSchema };
