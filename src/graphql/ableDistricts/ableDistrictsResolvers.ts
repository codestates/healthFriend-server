import { AuthenticationError } from 'apollo-server-express';
import Dataloader from 'dataloader';
import { getAbleDistrictsRepository } from '../../database';
import { Districts } from '../../database/entity/Districts';

const districtsLoader = new Dataloader<string, Districts>(
  (ableDistrictIds: readonly string[]) =>
    getAbleDistrictsRepository().batchDistricts(ableDistrictIds),
  { cache: false },
);

const ableDistrictsResolvers = {
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
    district: async (ableDistrict: any) =>
      districtsLoader.load(ableDistrict.id),
    // getAbleDistrictsRepository().findDistrictByAbleDistrictId(
    //   ableDistrict.id,
    // ),
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

export { ableDistrictsResolvers };
