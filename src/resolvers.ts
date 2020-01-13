import { ableDistrictsResolvers } from './modules/ableDistricts';
import { districtResolver } from './modules/district';
import { exerciseAbleDaysResolver } from './modules/exerciseAbleDays';
import { meResolver } from './modules/me';
import { motivationResolver } from './modules/motivation';
import { registerResolver } from './modules/register';
import { userResolver } from './modules/user';

const resolvers = [
  ableDistrictsResolvers,
  districtResolver,
  exerciseAbleDaysResolver,
  meResolver,
  motivationResolver,
  userResolver,
  registerResolver,
];

export default resolvers;
