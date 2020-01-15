import { gql } from 'apollo-server-express';

const districtSchema = gql`
  type District {
    idOfDong: ID!
    nameOfDong: String!
    idOfGu: Int!
    nameOfGu: String!
  }
`;

export { districtSchema };
