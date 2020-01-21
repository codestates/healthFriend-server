import { combineResolvers } from 'graphql-resolvers';
import { getDistrictRepository } from '../../database';
import { isAuthenticated } from '../auth';

const districtResolver = {
  Query: {
    allDistricts: combineResolvers(isAuthenticated, async () =>
      getDistrictRepository().getAllDistrict()),
  },
};

export { districtResolver };
