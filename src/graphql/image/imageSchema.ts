import { gql } from 'apollo-server-express';

const imageSchema = gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  type S3Object {
    ETag: String
    Location: String!
    Key: String!
    Bucket: String!
  }

  extend type Mutation {
    profileImageUpload(file: Upload!): S3Object
  }
`;

export { imageSchema };
