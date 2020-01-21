import { gql } from 'apollo-server-express';

const friendsSchema = gql`
  extend type Query {
    getFriends(userId: ID): Friends
  }

  extend type Mutation {
    addFriend(userId: String!): User
    checkFriends(userIds: [String]!): User
    deleteFriend(userId: String!): User
  }

  extend type Subscription {
    subscribeAddFriend: User
  }

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
