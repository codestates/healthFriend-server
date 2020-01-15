import { gql } from 'apollo-server-express';

const querySchema = gql`
  type AuthPayload {
    user: User
    token: String
  }

  type Query {
    test: User
    user(userId: String): User
    users: [User]!
    me: User
    motivations(input: [MotivationEnum]): [Motivation]
    exerciseAbleDays(input: [WeekdayEnum]): [ExerciseAbleDay]
    ableDistricts(dongIds: [String]): [AbleDistrict]
    allDistricts: [District]!
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
`;

export { querySchema };
