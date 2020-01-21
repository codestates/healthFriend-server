import { gql } from 'apollo-server-express';

const userSchema = gql`
  extend type Query {
    test: User
    user(userId: String): User
    users: [User]!
    userCount: Int!
    login(email: String, password: String): AuthPayload
    filterUsers(
      openImageChoice: [OpenImageChoiceEnum]
      gender: [GenderEnum]
      levelOf3Dae: [LevelOf3DaeEnum]
      motivations: [MotivationEnum]
      weekdays: [WeekdayEnum]
      districts: [String]
    ): [User]
  }

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
    following: [Follow]
    followers: [Follow]
    friends: [Friends]
    createdAt: DateTime!
  }

  type AuthPayload {
    user: User
    token: String
  }

  scalar DateTime
`;

export { userSchema };
