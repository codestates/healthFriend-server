import { AuthenticationError } from 'apollo-server-express';
import Dataloader from 'dataloader';
import { UserId, UserInfoContext } from '../../types/types';
import { getUserRepository, getFollowRepository } from '../../database';
import { User } from '../../database/entity/User';

const followingUsersLoader = new Dataloader<string, User>(
  (followIds: readonly string[]) =>
    getFollowRepository().batchFollowingUsers(followIds),
  { cache: false },
);

// 나의 follower들, 나를 following하고 있는 사람들
const followerUsersLoader = new Dataloader<string, User>(
  (followIds: readonly string[]) =>
    getFollowRepository().batchFollowerUsers(followIds),
  { cache: false },
);

const followResolver = {
  Query: {
    getFollowers: async (_: any, args: UserId, context: UserInfoContext) => {
      const { userInfo } = context;
      if (!userInfo) throw new AuthenticationError('Not authenticated.');

      const { userId } = args;
      const user = await getUserRepository().validateUserId(userId);
      const followers = await getFollowRepository().getFollowers(user);
      return followers;
    },
    getFollowing: async (_: any, args: UserId, context: UserInfoContext) => {
      const { userInfo } = context;
      if (!userInfo) throw new AuthenticationError('Not authenticated.');

      const { userId } = args;
      const user = await getUserRepository().validateUserId(userId);
      const following = await getFollowRepository().getFollowing(user);
      return following;
    },
  },

  Mutation: {
    followingUser: async (_: any, args: UserId, context: UserInfoContext) => {
      const { userInfo } = context;
      if (!userInfo) throw new AuthenticationError('Not authenticated.');

      const me = await getUserRepository().validateUserId(userInfo.id);
      const { userId } = args;
      const following = await getUserRepository().validateUserId(userId);
      const meFollow = await getFollowRepository().followingUser(me, following);
      return meFollow;
    },
    deleteFollowing: async (_: any, args: UserId, context: UserInfoContext) => {
      const { userInfo } = context;
      if (!userInfo) throw new AuthenticationError('Not authenticated.');

      const me = await getUserRepository().validateUserId(userInfo.id);
      const { userId } = args;
      const following = await getUserRepository().validateUserId(userId);
      const meFollow = await getFollowRepository().followingUser(me, following);
      return meFollow;
    },
    deleteFollower: async (_: any, args: UserId, context: UserInfoContext) => {
      const { userInfo } = context;
      if (!userInfo) throw new AuthenticationError('Not authenticated.');

      const me = await getUserRepository().validateUserId(userInfo.id);
      const { userId } = args;
      const follower = await getUserRepository().validateUserId(userId);
      const meFollow = await getFollowRepository().deleteFollower(me, follower);
      return meFollow;
    },
  },

  Follow: {
    following: async (follow: any) => followingUsersLoader.load(follow.id),
    // {
    //   // console.log('FOLLOWING: ', follow);
    //   // eslint-disable-next-line max-len
    //   const followingUser =
    //  await getFollowRepository().getFollowingUserByFollowId(
    //     follow.id,
    //   );
    //   return followingUser;
    // },

    // 나의 follower들, 나를 following하고 있는 사람들
    follower: async (follow: any) => followerUsersLoader.load(follow.id),
    // {
    //   // eslint-disable-next-line max-len
    //   const followerUser =
    // await getFollowRepository().getFollowerUserByFollowId(
    //     follow.id,
    //   );
    //   return followerUser;
    // },
  },

  Subscription: {
    subscribeRequestFriend: () => {},
  },
};

export { followResolver };
