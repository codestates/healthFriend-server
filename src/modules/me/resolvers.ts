import { DetailedUserInfo } from '../../types/User.types';
import {
  getUserRepository,
  // getMotivationRepository,
} from '../../database';
import { createMiddleware } from '../../utils/createMiddleware';
import middleware from './middleware';

const resolvers = {
  OpenImageChoiceEnum: {
    OPEN: 'OPEN',
    FRIEND: 'FRIEND',
    CLOSE: 'CLOSE',
  },

  LevelOf3DaeEnum: {
    L1: 'L1',
    L2: 'L2',
    L3: 'L3',
    L4: 'L4',
    L5: 'L5',
  },

  MotivationEnum: {
    WEIGHT_INCREASE: 'WEIGHT_INCREASE',
    WEIGHT_LOSS: 'WEIGHT_LOSS',
    FIND_FRIEND: 'FIND_FRIEND',
    LONELINESS: 'LONELINESS',
  },

  Query: {
    me: createMiddleware(middleware, (_: any, __: any, context: any) =>
      // console.log(context);
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
        // console.log(user);
        return user;
      },
    ),
  },
};

export default resolvers;
