import { AuthenticationError } from 'apollo-server-express';
import { DetailedUserInfo } from '../../types/User.types';
import {
  getUserRepository,
  // getMotivationRepository,
} from '../../database';

const meResolver = {
  GenderEnum: {
    MALE: 'MALE',
    FEMALE: 'FEMALE',
  },

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
    me: async (_: any, __: any, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('not authenticated');
      return getUserRepository().findByUserId(userInfo.id);
    },
  },

  Mutation: {
    me: async (_: any, args: DetailedUserInfo, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('not authenticated');
      const user = await getUserRepository().updateUserInfo(
        userInfo.id,
        args,
      );
        // console.log(user);
      return user;
    },
  },
};

export { meResolver };
