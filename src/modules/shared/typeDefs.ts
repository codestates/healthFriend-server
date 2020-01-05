import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum GenderEnum {
    MALE
    FEMALE
  }

  enum OpenImageChoiceEnum {
    OPEN
    FRIEND
    CLOSE
  }

  enum LevelOf3DaeEnum {
    L1
    L2
    L3
    L4
    L5
  }

  enum MotivationEnum {
    WEIGHT_INCREASE
    WEIGHT_LOSS
    FIND_FRIEND
    LONELINESS
  }

  type Motivation {
    id: ID!
    motivation: String!
    owner: User!
  }

  enum WeekdayEnum {
    MONDAY
    TUESDAY
    WEDNESDAY
    THURSDAY
    FRIDAY
    SATURDAY
    SUNDAY
  }

  type ExerciseAbleDay {
    id: ID!
    weekday: String!
    user: User!
  }

  type District {
    idOfDong: ID!
    nameOfDong: String!
    idOfGu: Int!
    nameOfGu: String!
  }

  type AbleDistrict {
    id: ID!
    district: District!
    user: User!
  }

  type User {
    id: ID!
    email: String!
    nickname: String!
    gender: String!
    openImageChoice: String!
    levelOf3Dae: String!
    messageToFriend: String
    motivations: [Motivation]
    weekdays: [ExerciseAbleDay]
    ableDistricts: [AbleDistrict]
    following: [User]
    followers: [User]
  }

  type Query {
    user(userId: String): User
    users: [User]!
    me: User
    motivations(input: [MotivationEnum]): [Motivation]
    exerciseAbleDays(input: [WeekdayEnum]): [ExerciseAbleDay]
    ableDistricts(dongIds: [String]): [AbleDistrict]
    allDistricts: [District]!
    getFollowing: [User]!
    getFollowers: [User]!
    filterUsers(
      openImageChoice: [OpenImageChoiceEnum],
      gender: [GenderEnum]
      levelOf3Dae: [LevelOf3DaeEnum],
      motivations: [MotivationEnum]
      weekdays: [WeekdayEnum]
      districts: [String]
    ): [User]
  }

  type Mutation {
    setMotivation(input: [MotivationEnum]): [Motivation]
    setExerciseAbleDay(input: [WeekdayEnum]): [ExerciseAbleDay]
    setAbleDistrict(dongIds: [String]): [AbleDistrict]
    followingUser(userId: String!): User
    deleteFollowing(userId: String!): User
    deleteFollowers(userId: String!): User
    me(
      nickname: String!
      gender: GenderEnum!
      openImageChoice: OpenImageChoiceEnum!
      levelOf3Dae: LevelOf3DaeEnum!
      messageToFriend: String
    ): User!
  }
`;

export default typeDefs;
