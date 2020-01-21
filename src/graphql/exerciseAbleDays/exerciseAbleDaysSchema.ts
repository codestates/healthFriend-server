import { gql } from 'apollo-server-express';

const exerciseAbleDaysSchema = gql`
  extend type Query {
    exerciseAbleDays(input: [WeekdayEnum]): [ExerciseAbleDay]
  }

  extend type Mutation {
    setExerciseAbleDay(input: [WeekdayEnum]): [ExerciseAbleDay]
  }

  type ExerciseAbleDay {
    id: ID!
    weekday: String!
    user: User!
  }
`;

export { exerciseAbleDaysSchema };
