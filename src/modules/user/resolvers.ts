import {
  getUserRepository,
  getMotivationRepository,
  getExerciseAbleDaysRepository,
  getAbleDistrictsRepository,
} from '../../database';

const resolvers = {
  Query: {
    user: async (_: any, args: any) => {
      const { userId } = args;
      return getUserRepository().findByUserId(userId);
    },
    users: async () => getUserRepository().getAllUser(),
  },

  User: {
    motivations: async (parent: any) => {
      const result = await getMotivationRepository().findByUserId(parent.id);
      return result;
    },
    weekdays: async (parent: any) => {
      const result = await getExerciseAbleDaysRepository().findByUserId(
        parent.id,
      );
      return result;
    },
    ableDistricts: async (parent: any) => {
      const result = await getAbleDistrictsRepository().findByUserId(
        parent.id,
      );
      return result;
    },
  },
};

export default resolvers;
