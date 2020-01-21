import { combineResolvers } from 'graphql-resolvers';
import Dataloader from 'dataloader';
import { getAbleDistrictsRepository } from '../../database';
import { Districts } from '../../database/entity/Districts';
import { isAuthenticated } from '../auth';

const districtsLoader = new Dataloader<string, Districts>(
  (ableDistrictIds: readonly string[]) =>
    getAbleDistrictsRepository().batchDistricts(ableDistrictIds),
  { cache: false },
);

const ableDistrictsResolvers = {
  Query: {
    ableDistricts: combineResolvers(
      isAuthenticated,
      async (_: any, args: any) => {
        if (!args.dongIds) {
          return getAbleDistrictsRepository().find();
        }
        return getAbleDistrictsRepository().findByDongIds(args.dongIds);
      },
    ),
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
    setAbleDistrict: combineResolvers(
      isAuthenticated,
      async (_: any, args: any, { userInfo }) => {
        const ableDistricts = await getAbleDistrictsRepository().saveByDongId(
          userInfo.id,
          args.dongIds,
        );
        return ableDistricts;
      },
    ),
  },
};

export { ableDistrictsResolvers };
