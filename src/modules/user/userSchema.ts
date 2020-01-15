import { gql } from 'apollo-server-express';

const userSchema = gql`
  scalar DateTime

  type User {
    id: ID!
    role: String!
    email: String!
    nickname: String!
    provider: String!
    gender: String!
    openImageChoice: String!
    levelOf3Dae: String!
    messageToFriend: String
    motivations: [Motivation]
    weekdays: [ExerciseAbleDay]
    ableDistricts: [AbleDistrict]
    following: [User]
    followers: [User]
    friends: [User]
    createdAt: DateTime!
  }
`;

export { userSchema };
