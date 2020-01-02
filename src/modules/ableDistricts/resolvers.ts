import {
  getAbleDistrictsRepository,
} from '../../database';

const resolvers = {
  Query: {
    ableDistricts: async (_: any, args: any) => {
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
    setAbleDistrict: async (_: any, args: any, context:any) => {
      if (!context.userInfo && !context.userInfo.id) {
        return null;
      }
      const ableDistricts = await getAbleDistrictsRepository().saveByDongId(
        context.userInfo.id,
        args.dongIds,
      );
      return ableDistricts;
    },
  },
};

export default resolvers;
