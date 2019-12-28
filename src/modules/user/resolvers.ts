import { getUserRepository, getMotivationRepository } from '../../database';

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
  },
};

export default resolvers;
