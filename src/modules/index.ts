import {
  querySchema,
  mutationSchema,
  subscriptionSchema,
  enumSchema,
} from './shared';
import { userSchema, userResolver } from './user';
import { registerResolver } from './register';
import { motivationResolver, motivationSchema } from './motivation';
import { meResolver } from './me';
import { friendsResolver, friendsSchema } from './friends';
import { followResolver, followSchema } from './follow';
import {
  exerciseAbleDaysResolver,
  exerciseAbleDaysSchema,
} from './exerciseAbleDays';
import { districtResolver, districtSchema } from './district';
import { ableDistrictsResolvers, ableDistrictsSchema } from './ableDistricts';

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
];

const schemas = [
  querySchema,
  mutationSchema,
  subscriptionSchema,
  enumSchema,
  ableDistrictsSchema,
  districtSchema,
  exerciseAbleDaysSchema,
  motivationSchema,
  userSchema,
  friendsSchema,
  followSchema,
];

export { resolvers, schemas };
