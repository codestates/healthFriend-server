import {
  getUserRepository, getMotivationRepository,
} from '../../utils/connectDB';

const resolvers = {
  Query: {
    user: async (_: any, args: any) => {
      const { userId } = args;
      return getUserRepository().findByUserId(userId);
    },
    users: async (_: any, args: any) => {
      console.log(args);
      return getUserRepository().getAllUser();
    },
  },

  User: {
    motivations: async (parent: any) => {
      const result = await getMotivationRepository().findByUserId(parent.id);
      return result;
    },
  },
};

export default resolvers;
