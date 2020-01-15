import { querySchema, mutationSchema, enumSchema } from './modules/shared';
import { ableDistrictsSchema } from './modules/ableDistricts';
import { districtSchema } from './modules/district';
import { exerciseAbleDaysSchema } from './modules/exerciseAbleDays';
import { motivationSchema } from './modules/motivation';
import { userSchema } from './modules/user';

const schemas = [
  querySchema,
  mutationSchema,
  enumSchema,
  ableDistrictsSchema,
  districtSchema,
  exerciseAbleDaysSchema,
  motivationSchema,
  userSchema,
];

export default schemas;
