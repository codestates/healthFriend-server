import { gql } from 'apollo-server-express';

const ableDistrictsSchema = gql`
  type AbleDistrict {
    id: ID!
    district: District!
    user: User!
  }
`;

export { ableDistrictsSchema };
