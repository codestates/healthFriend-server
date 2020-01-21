import { AuthenticationError } from 'apollo-server-express';
import { getDistrictRepository } from '../../database';

const districtResolver = {
  Query: {
    allDistricts: async (_: any, __: any, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getDistrictRepository().getAllDistrict();
    },
  },
};

export { districtResolver };
