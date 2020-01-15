import { AuthenticationError, PubSub } from 'apollo-server-express';
import Dataloader from 'dataloader';

import { UserQueryCondition, LoginInfo } from '../../types/User.types';
import {
  getUserRepository,
  getAbleDistrictsRepository,
  getFriendsRepository,
} from '../../database';
import { Motivations } from '../../database/entity/Motivations';
import { ExerciseAbleDays } from '../../database/entity/ExerciseAbleDays';

const CHECK_FOLLOW = 'CHECK_FOLLOW';
const ADD_FRIEND = 'ADD_FRIEND';

interface UserId {
  userId: string;
}

interface UserInfo {
  id: string;
}

interface PubSubContext {
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
    user: async (_: any, args: UserId, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getUserRepository().findByUserId(args.userId);
    },
    users: async (_: any, __: any, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getUserRepository().getAllUser();
    },
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

    ableDistricts: async (parent: any) =>
      getAbleDistrictsRepository().findByUserId(parent.id),

    friends: async (parent: any) =>
      getFriendsRepository().findByUserId(parent.id),
  },

  Mutation: {
    followingUser: async (_: any, args: UserId, context: PubSubContext) => {
      const { userInfo, pubsub } = context;
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      const me = await getUserRepository().followingUser(
        userInfo.id,
        args.userId,
      );
      if (me) {
        pubsub.publish(`${CHECK_FOLLOW}_${args.userId}`, {
          subscribeRequestFriend: me,
        });
        return me;
      }
      return null;
    },
    deleteFollowing: async (_: any, args: UserId, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getUserRepository().deleteFollowing(userInfo.id, args.userId);
    },
    deleteFollowers: async (_: any, args: UserId, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getUserRepository().deleteFollowers(userInfo.id, args.userId);
    },
    addFriend: async (_: any, args: UserId, context: PubSubContext) => {
      const { userInfo, pubsub } = context;
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      const me = await getFriendsRepository().addFriend(
        userInfo.id,
        args.userId,
      );
      if (me) {
        pubsub.publish(`${ADD_FRIEND}_${args.userId}`, {
          subscribeAddFriend: me,
        });
        return me;
      }
      return null;
    },
    deleteFriend: async (_: any, args: UserId, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getFriendsRepository().deleteFriend(userInfo.id, args.userId);
    },
  },

  Subscription: {
    subscribeRequestFriend: {
      subscribe(_: any, __: any, context: PubSubContext) {
        const { userInfo, pubsub } = context;
        if (!userInfo) throw new AuthenticationError('Not authenticated.');
        return pubsub.asyncIterator(`${CHECK_FOLLOW}_${userInfo.id}`);
      },
    },
    subscribeAddFriend: {
      subscribe(_: any, __: any, context: PubSubContext) {
        const { userInfo: me, pubsub } = context;
        if (!me) throw new AuthenticationError('Not authenticated.');
        return pubsub.asyncIterator(`${ADD_FRIEND}_${me.id}`);
      },
    },
  },
};

export { userResolver };
