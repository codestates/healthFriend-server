import { UserQueryCondition } from '../../types/User.types';
import {
  getUserRepository,
  getMotivationRepository,
  getExerciseAbleDaysRepository,
  getAbleDistrictsRepository,
  getFriendsRepository,
} from '../../database';

const resolvers = {
  Query: {
    user: async (_: any, args: any) => {
      const { userId } = args;
      return getUserRepository().findByUserId(userId);
    },
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
      const results = getUserRepository().filterUsers(whereObject);
      return results;
    },
  },

  User: {
    motivations: async (parent: any) => {
      const result = await getMotivationRepository().findByUserId(parent.id);
      return result;
    },
    weekdays: async (parent: any) => {
      const result = await getExerciseAbleDaysRepository().findByUserId(
        parent.id,
      );
      return result;
    },
    ableDistricts: async (parent: any) => {
      const result = await getAbleDistrictsRepository().findByUserId(parent.id);
      return result;
    },
    friends: async (parent: any) => {
      const result = await getFriendsRepository().findByUserId(parent.id);
      return result;
    },
  },

  Mutation: {
    followingUser: async (_: any, args: any, context: any) => {
      if (!context.userInfo && !context.userInfo.id) {
        return null;
      }
      const user = await getUserRepository().followingUser(
        context.userInfo.id,
        args.userId,
      );
      return user;
    },
    deleteFollowing: async (_: any, args: any, context: any) => {
      if (!context.userInfo && !context.userInfo.id) {
        return null;
      }
      const user = await getUserRepository().deleteFollowing(
        context.userInfo.id,
        args.userId,
      );
      return user;
    },
    deleteFollowers: async (_: any, args: any, context: any) => {
      if (!context.userInfo && !context.userInfo.id) {
        return null;
      }
      const user = await getUserRepository().deleteFollowers(
        context.userInfo.id,
        args.userId,
      );
      return user;
    },
    addFriend: async (_: any, args: any, context: any) => {
      if (!context.userInfo && !context.userInfo.id) {
        return null;
      }
      const user = await getFriendsRepository().addFriend(
        context.userInfo.id,
        args.userId,
      );
      return user;
    },
    deleteFriend: async (_: any, args: any, context: any) => {
      if (!context.userInfo && !context.userInfo.id) {
        return null;
      }
      const user = await getFriendsRepository().deleteFriend(
        context.userInfo.id,
        args.userId,
      );
      return user;
    },
  },
};

export default resolvers;
