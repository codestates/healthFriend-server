import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type Query {
    me: User
  }

  type Mutation {
    me(
      nickname: String!
      openImageChoice: OpenImageChoice!
      """
      L1 = '1: 0 ~ 99'\n
      L2 = '2: 100 ~ 199'\n
      L3 = '3: 200 ~ 299'\n
      L4 = '4: 300 ~ 399'\n
      L5 = '5: 400 ~ 499'
      """
      levelOf3Dae: LevelOf3Dae!
      messageToFriend: String
    ): User!
  }
`;

export default typeDefs;
