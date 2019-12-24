import { DetailedUserInfo } from '../../types/User.types';
import { getUserRepository } from '../../utils/connectDB';
import { createMiddleware } from '../../utils/createMiddleware';
import middleware from './middleware';

const resolvers = {
  OpenImageChoice: {
    OPEN: 'open',
    FRIEND: 'friend',
    CLOSE: 'close',
  },
  LevelOf3Dae: {
    L1: '1: 0 ~ 99',
    L2: '2: 100 ~ 199',
    L3: '3: 200 ~ 299',
    L4: '4: 300 ~ 399',
    L5: '5: 400 ~ 499',
  },
  Query: {
    me: createMiddleware(middleware, (_: any, __: any, context: any) =>
      getUserRepository().findByUserId(context.userInfo.id)),
  },
  Mutation: {
    me: createMiddleware(
      middleware,
      async (_: any, args: DetailedUserInfo, context: any) => {
        const user = await getUserRepository().updateUserInfo(
          context.userInfo.id,
          args,
        );
        console.log(user);
        return user;
      },
    ),
  },
};

export default resolvers;
