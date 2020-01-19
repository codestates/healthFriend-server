import { AuthenticationError } from 'apollo-server-express';
import { UserInfoContext, DetailedUserInfo } from '../../types/types';

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
    me: async (_: any, __: any, context: UserInfoContext) => {
      const { userInfo } = context;
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      // console.log('ME resolver: ', userInfo.id);
      return getUserRepository().getUserInfoById(userInfo.id);
    },
  },

  Mutation: {
    me: async (_: any, args: DetailedUserInfo, context: UserInfoContext) => {
      const { userInfo } = context;
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      const updateUser = getUserRepository().create({
        id: userInfo.id,
        nickname: args.nickname,
        gender: args.gender,
        openImageChoice: args.openImageChoice,
        levelOf3Dae: args.levelOf3Dae,
        messageToFriend: args.messageToFriend,
      });
      const user = await getUserRepository().updateUserInfo(updateUser);
      // console.log(user);
      return user;
    },
  },
};

export { meResolver };
