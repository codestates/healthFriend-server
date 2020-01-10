import { AuthenticationError } from 'apollo-server-express';
import Dataloader from 'dataloader';

import { UserQueryCondition, LoginInfo } from '../../types/User.types';
import {
  getUserRepository,
  getExerciseAbleDaysRepository,
  getAbleDistrictsRepository,
  getFriendsRepository,
} from '../../database';
import { Motivations } from '../../database/entity/Motivations';

interface UserId {
  userId: string;
}

type BatchMotivations = (
  userIds: readonly string[],
) => Promise<Motivations[][]>;

const batchMotivations: BatchMotivations = async (
  userIds: readonly string[],
) => {
  const users = await getUserRepository()
    .createQueryBuilder('user')
    .leftJoinAndSelect('user.motivations', 'motivations')
    .where('user.id IN (:...userIds)', { userIds })
    .getMany();
  // console.log(users);
  return users.map((u) => u.motivations);
};

const motivationLoader = new Dataloader<string, Motivations[]>(
  batchMotivations,
);

const resolvers = {
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
      return getUserRepository().followingUser(userInfo.id, args.userId);
    },
    deleteFollowing: async (_: any, args: UserId, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getUserRepository().deleteFollowing(userInfo.id, args.userId);
    },
    deleteFollowers: async (_: any, args: UserId, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getUserRepository().deleteFollowers(userInfo.id, args.userId);
    },
    addFriend: async (_: any, args: UserId, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getFriendsRepository().addFriend(userInfo.id, args.userId);
    },
    deleteFriend: async (_: any, args: UserId, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      return getFriendsRepository().deleteFriend(userInfo.id, args.userId);
    },
  },
};

export default resolvers;
