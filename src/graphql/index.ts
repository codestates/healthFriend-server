import { gql } from 'apollo-server-express';
import { enumSchema } from './shared';
import { userSchema, userResolver } from './user';
import { registerResolver, registerSchema } from './register';
import { motivationResolver, motivationSchema } from './motivation';
import { meResolver, meSchema } from './me';
import { friendsResolver, friendsSchema } from './friends';
import { followResolver, followSchema } from './follow';
import {
  exerciseAbleDaysResolver,
  exerciseAbleDaysSchema,
} from './exerciseAbleDays';
import { districtResolver, districtSchema } from './district';
import { ableDistrictsResolvers, ableDistrictsSchema } from './ableDistricts';
import { imageResolver, imageSchema } from './image';

const resolvers = [
  ableDistrictsResolvers,
  districtResolver,
  exerciseAbleDaysResolver,
  meResolver,
  motivationResolver,
  userResolver,
  registerResolver,
  friendsResolver,
  followResolver,
  imageResolver,
];

const linkSchema = gql`
  type Query {
    _: Boolean
  }
  type Mutation {
    _: Boolean
  }
  type Subscription {
    _: Boolean
  }
`;

const schemas = [
  linkSchema,
  enumSchema,
  ableDistrictsSchema,
  districtSchema,
  exerciseAbleDaysSchema,
  motivationSchema,
  meSchema,
  userSchema,
  registerSchema,
  friendsSchema,
  followSchema,
  imageSchema,
];

export { resolvers, schemas };
