import Dataloader from 'dataloader';
import { combineResolvers } from 'graphql-resolvers';

import { UserQueryCondition, LoginInfo, UserInfo } from '../../types/types';
import { getUserRepository } from '../../database';
import { Motivations } from '../../database/entity/Motivations';
import { ExerciseAbleDays } from '../../database/entity/ExerciseAbleDays';
import { AbleDistricts } from '../../database/entity/AbleDistricts';
import { Image } from '../../database/entity/Image';
import { Follow } from '../../database/entity/Follow';
import { Friends } from '../../database/entity/Friends';
import { isAuthenticated } from '../auth';

const motivationLoader = new Dataloader<string, Motivations[]>(
  (userIds: readonly string[]) => getUserRepository().batchMotivations(userIds),
  { cache: false },
);

const weekdaysLoader = new Dataloader<string, ExerciseAbleDays[]>(
  (userIds: readonly string[]) =>
    getUserRepository().batchExerciseAbleDays(userIds),
  { cache: false },
);

const districtsLoader = new Dataloader<string, AbleDistricts[]>(
  (userIds: readonly string[]) =>
    getUserRepository().batchAbleDistricts(userIds),
  { cache: false },
);

const imagesLoader = new Dataloader<string, Image[]>(
  (userIds: readonly string[]) =>
    getUserRepository().batchImages(userIds),
  { cache: false },
);

// 내가 following 하고 있는 사람들
const followingLoader = new Dataloader<string, Follow[]>(
  (userIds: readonly string[]) => getUserRepository().batchFollowing(userIds),
  { cache: false },
);

// 나의 follower들, 나를 following하고 있는 사람들
const followersLoader = new Dataloader<string, Follow[]>(
  (userIds: readonly string[]) => getUserRepository().batchFollowers(userIds),
  { cache: false },
);

const friendsLoader = new Dataloader<string, Friends[]>(
  (userIds: readonly string[]) => getUserRepository().batchFriends(userIds),
  { cache: false },
);

const userResolver = {
  Query: {
    test: async () => getUserRepository().test(),

    user: combineResolvers(isAuthenticated, async (_: any, args: any) => {
      const user = await getUserRepository().validateUserId(args.userId);
      // console.log('userResolver - user: ', user);
      return getUserRepository().getUserInfo(user);
    }),

    users: combineResolvers(isAuthenticated, async () =>
      getUserRepository().getAllUser()),

    userCount: async () => getUserRepository().getUserCount(),

    filterUsers: combineResolvers(
      isAuthenticated,
      async (_: any, args: UserQueryCondition) => {
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
    ),

    login: async (_: any, args: LoginInfo) => getUserRepository().login(args),
  },

  User: {
    motivations: async (user: any) => motivationLoader.load(user.id),
    // getMotivationRepository().findByUserId(user.id),

    weekdays: async (user: any) => weekdaysLoader.load(user.id),
    // getExerciseAbleDaysRepository().findByUserId(user.id),

    ableDistricts: async (user: any) => districtsLoader.load(user.id),
    // getAbleDistrictsRepository().findByUserId(user.id),

    profileImage: async (user: UserInfo) => imagesLoader.load(user.id),

    // 내가 following 하고 있는 사람들
    following: async (user: any) => followingLoader.load(user.id),
    // getFollowRepository().getFollowingById(user.id),

    // 나의 follower들, 나를 following하고 있는 사람들
    followers: async (user: any) => followersLoader.load(user.id),
    // getFollowRepository().getFollowersById(user.id),

    friends: async (user: any) => friendsLoader.load(user.id),
    // getFriendsRepository().getFriendsById(user.id),
  },
};

export { userResolver };
