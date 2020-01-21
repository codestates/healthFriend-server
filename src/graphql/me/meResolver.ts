import { combineResolvers } from 'graphql-resolvers';
import { DetailedUserInfo } from '../../types/types';

import { getUserRepository } from '../../database';
import { isAuthenticated } from '../auth';

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
    me: combineResolvers(
      isAuthenticated,
      async (_: any, __: any, { userInfo }) =>
        getUserRepository().getUserInfoById(userInfo.id),
    ),
  },

  Mutation: {
    me: combineResolvers(
      isAuthenticated,
      async (_: any, args: DetailedUserInfo, { userInfo }) => {
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
    ),
  },
};

export { meResolver };
