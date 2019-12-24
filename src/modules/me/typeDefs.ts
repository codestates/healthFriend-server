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

  type User {
    id: ID!
    email: String!
    nickname: String!
    openImageChoice: String!
    levelOf3Dae: String!
    messageToFriend: String
  }

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
