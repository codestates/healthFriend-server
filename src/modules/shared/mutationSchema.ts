import { gql } from 'apollo-server-express';

const mutationSchema = gql`
  type Mutation {
    setMotivation(input: [MotivationEnum]): [Motivation]
    setExerciseAbleDay(input: [WeekdayEnum]): [ExerciseAbleDay]
    setAbleDistrict(dongIds: [String]): [AbleDistrict]
    followingUser(userId: String!): User
    checkFollower(userIds: [String]!): User
    deleteFollowing(userId: String!): User
    deleteFollower(userId: String!): User
    addFriend(userId: String!): Friends
    deleteFriend(userId: String!): User
    registerForTest(email: String!, password: String!): AuthPayload!
    me(
      nickname: String!
      gender: GenderEnum!
      openImageChoice: OpenImageChoiceEnum!
      levelOf3Dae: LevelOf3DaeEnum!
      messageToFriend: String
    ): User!
  }
`;

export { mutationSchema };
