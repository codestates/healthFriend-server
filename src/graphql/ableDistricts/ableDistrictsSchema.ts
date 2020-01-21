import { gql } from 'apollo-server-express';

const ableDistrictsSchema = gql`
  extend type Query {
    ableDistricts(dongIds: [String]): [AbleDistrict]
  }

  extend type Mutation {
    setAbleDistrict(dongIds: [String]): [AbleDistrict]
  }

  type AbleDistrict {
    id: ID!
    district: District!
    user: User!
  }
`;

export { ableDistrictsSchema };
