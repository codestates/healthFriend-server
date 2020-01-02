import { getDistrictRepository } from '../../database';

const resolvers = {
  Query: {
    allDistricts: () => {
      const results = getDistrictRepository().getAllDistrict();
      return results;
    },
  },
};

export default resolvers;
