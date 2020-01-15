import { gql } from 'apollo-server-express';

const exerciseAbleDaysSchema = gql`
  type ExerciseAbleDay {
    id: ID!
    weekday: String!
    user: User!
  }
`;

export { exerciseAbleDaysSchema };
