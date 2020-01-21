import { gql } from 'apollo-server-express';

const motivationSchema = gql`
  extend type Query {
    motivations(input: [MotivationEnum]): [Motivation]
  }

  extend type Mutation {
    setMotivation(input: [MotivationEnum]): [Motivation]
  }

  type Motivation {
    id: ID!
    motivation: String!
    owner: User!
  }
`;

export { motivationSchema };
