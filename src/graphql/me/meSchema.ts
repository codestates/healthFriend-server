import { gql } from 'apollo-server-express';

const meSchema = gql`
  extend type Query {
    me: User
  }

  extend type Mutation {
    me(
      nickname: String!
      gender: GenderEnum!
      openImageChoice: OpenImageChoiceEnum!
      levelOf3Dae: LevelOf3DaeEnum!
      messageToFriend: String
    ): User!
  }
`;

export { meSchema };
