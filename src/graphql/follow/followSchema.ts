import { gql } from 'apollo-server-express';

const followSchema = gql`
  extend type Query {
    getFollowers(userId: ID): Follow
    getFollowing(userId: ID): Follow
  }

  extend type Mutation {
    followingUser(userId: String!): User
    checkFollowers(userIds: [String]!): User
    deleteFollowing(userId: String!): User
    deleteFollower(userId: String!): User
  }

  extend type Subscription {
    subscribeRequestFriend: User
  }

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
