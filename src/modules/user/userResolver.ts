import { AuthenticationError, PubSub } from 'apollo-server-express';
import Dataloader from 'dataloader';

import { UserQueryCondition, LoginInfo, UserInfo } from '../../types/types';
import {
  getUserRepository,
  getAbleDistrictsRepository,
  getFollowRepository,
  getFriendsRepository,
} from '../../database';
import { Motivations } from '../../database/entity/Motivations';
import { ExerciseAbleDays } from '../../database/entity/ExerciseAbleDays';

// const CHECK_FOLLOW = 'CHECK_FOLLOW';
// const ADD_FRIEND = 'ADD_FRIEND';

export interface PubSubContext {
  userInfo: UserInfo;
  pubsub: PubSub;
}

const motivationLoader = new Dataloader<string, Motivations[]>(
  (userIds: readonly string[]) => getUserRepository().batchMotivations(userIds),
);

const weekdaysLoader = new Dataloader<string, ExerciseAbleDays[]>(
  (userIds: readonly string[]) =>
    getUserRepository().batchExerciseAbleDays(userIds),
);

const userResolver = {
  Query: {
    test: async () => getUserRepository().test(),
    user: async (_: any, args: any, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      const user = await getUserRepository().validateUserId(args.userId);
      // console.log('userResolver - user: ', user);
      return getUserRepository().getUserInfo(user);
    },
    users: async (_: any, __: any, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getUserRepository().getAllUser();
    },
    userCount: async () => getUserRepository().getUserCount(),
    filterUsers: async (
      _: any,
      args: UserQueryCondition,
      { userInfo }: any,
    ) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      const whereObject: UserQueryCondition = {
        gender: args.gender || [],
        openImageChoice: args.openImageChoice || [],
        levelOf3Dae: args.levelOf3Dae || [],
        motivations: args.motivations || [],
        weekdays: args.weekdays || [],
        districts: args.districts || [],
      };
      return getUserRepository().filterUsers(whereObject);
    },
    login: async (_: any, args: LoginInfo) => getUserRepository().login(args),
  },

  User: {
    motivations: async (user: any) => motivationLoader.load(user.id),
    // getMotivationRepository().findByUserId(user.id),

    weekdays: async (user: any) => weekdaysLoader.load(user.id),
    // getExerciseAbleDaysRepository().findByUserId(user.id),

    ableDistricts: async (user: any) =>
      getAbleDistrictsRepository().findByUserId(user.id),

    following: async (user: any) =>
      getFollowRepository().getFollowingById(user.id),

    followers: async (user: any) =>
      getFollowRepository().getFollowersById(user.id),

    friends: async (user: any) =>
      getFriendsRepository().getFriendsById(user.id),
  },

  // Subscription: {
  //   subscribeRequestFriend: {
  //     subscribe(_: any, __: any, context: PubSubContext) {
  //       const { userInfo, pubsub } = context;
  //       if (!userInfo) throw new AuthenticationError('Not authenticated.');
  //       return pubsub.asyncIterator(`${CHECK_FOLLOW}_${userInfo.id}`);
  //     },
  //   },
  //   subscribeAddFriend: {
  //     subscribe(_: any, __: any, context: PubSubContext) {
  //       const { userInfo: me, pubsub } = context;
  //       if (!me) throw new AuthenticationError('Not authenticated.');
  //       return pubsub.asyncIterator(`${ADD_FRIEND}_${me.id}`);
  //     },
  //   },
  // },
};

export { userResolver };
