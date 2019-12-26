// import { DetailedUserInfo } from '../../types/User.types';
import { getUserRepository } from '../../utils/connectDB';
// import { createMiddleware } from '../../utils/createMiddleware';

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
};

export default resolvers;
