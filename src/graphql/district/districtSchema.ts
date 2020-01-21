import { gql } from 'apollo-server-express';

const districtSchema = gql`
  extend type Query {
    allDistricts: [District]!
  }

  type District {
    idOfDong: ID!
    nameOfDong: String!
    idOfGu: Int!
    nameOfGu: String!
  }
`;

export { districtSchema };
