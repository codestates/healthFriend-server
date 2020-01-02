import { gql } from 'apollo-server-express';

const typeDefs = gql`
  enum OpenImageChoice {
    OPEN
    FRIEND
    CLOSE
  }

  enum LevelOf3Dae {
    "L1 = '1: 0 ~ 99'"
    L1
    "L2 = '2: 100 ~ 199'"
    L2
    "L3 = '3: 200 ~ 299'"
    L3
    "L4 = '4: 300 ~ 399'"
    L4
    "L5 = '5: 400 ~ 499'"
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

  type User {
    id: ID!
    email: String!
    nickname: String!
    openImageChoice: String!
    levelOf3Dae: String!
    messageToFriend: String
    motivations: [Motivation]
    weekdays: [ExerciseAbleDay]
  }

  type Query {
    user(userId: String): User
    users: [User]!
    me: User
    motivations(input: [MotivationEnum]): [Motivation]
    exerciseAbleDays(input: [WeekdayEnum]): [ExerciseAbleDay]
    allDistricts: [District]!
  }

  type Mutation {
    setMotivation(input: [MotivationEnum]): [Motivation]
    setExerciseAbleDay(input: [WeekdayEnum]): [ExerciseAbleDay]
    me(
      nickname: String!
      openImageChoice: OpenImageChoice!
      """
      L1 = '1: 0 ~ 99'

      L2 = '2: 100 ~ 199'

      L3 = '3: 200 ~ 299'

      L4 = '4: 300 ~ 399'

      L5 = '5: 400 ~ 499'
      """
      levelOf3Dae: LevelOf3Dae!
      messageToFriend: String
    ): User!
  }
`;

export default typeDefs;
