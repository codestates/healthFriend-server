import { AuthenticationError } from 'apollo-server-express';
import {
  getAbleDistrictsRepository,
} from '../../database';

const resolvers = {
  Query: {
    ableDistricts: async (_: any, args: any, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      if (!args.dongIds) {
        return getAbleDistrictsRepository().find();
      }
      return getAbleDistrictsRepository().findByDongIds(args.dongIds);
    },
  },

  AbleDistrict: {
    user: async (parent: any) =>
      getAbleDistrictsRepository().findUserByAbleDistrictId(parent.id),
    district: async (parent: any) =>
      getAbleDistrictsRepository().findDistrictByAbleDistrictId(parent.id),

  },

  Mutation: {
    setAbleDistrict: async (_: any, args: any, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      const ableDistricts = await getAbleDistrictsRepository().saveByDongId(
        userInfo.id,
        args.dongIds,
      );
      return ableDistricts;
    },
  },
};

export default resolvers;
