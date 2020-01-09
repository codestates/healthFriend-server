import { AuthenticationError } from 'apollo-server-express';
import { UserQueryCondition, LoginInfo } from '../../types/User.types';
import {
  getUserRepository,
  getMotivationRepository,
  getExerciseAbleDaysRepository,
  getAbleDistrictsRepository,
  getFriendsRepository,
} from '../../database';

interface UserId {
  userId: string;
}

const resolvers = {
  Query: {
    test: async () => getUserRepository().test(),
    user: async (_: any, args: UserId) =>
      getUserRepository().findByUserId(args.userId),
    users: async () => getUserRepository().getAllUser(),
    filterUsers: async (_: any, args: any) => {
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
    motivations: async (parent: any) =>
      getMotivationRepository().findByUserId(parent.id),

    weekdays: async (parent: any) =>
      getExerciseAbleDaysRepository().findByUserId(parent.id),

    ableDistricts: async (parent: any) =>
      getAbleDistrictsRepository().findByUserId(parent.id),

    friends: async (parent: any) =>
      getFriendsRepository().findByUserId(parent.id),
  },

  Mutation: {
    followingUser: async (_: any, args: UserId, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getUserRepository().followingUser(
        userInfo.id,
        args.userId,
      );
    },
    deleteFollowing: async (_: any, args: UserId, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getUserRepository().deleteFollowing(
        userInfo.id,
        args.userId,
      );
    },
    deleteFollowers: async (_: any, args: UserId, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getUserRepository().deleteFollowers(
        userInfo.id,
        args.userId,
      );
    },
    addFriend: async (_: any, args: UserId, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getFriendsRepository().addFriend(
        userInfo.id,
        args.userId,
      );
    },
    deleteFriend: async (_: any, args: UserId, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getFriendsRepository().deleteFriend(
        userInfo.id,
        args.userId,
      );
    },
  },
};

export default resolvers;
