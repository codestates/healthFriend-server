import { combineResolvers } from 'graphql-resolvers';
import Dataloader from 'dataloader';
import {
  UserId,
  UserIds,
  PubSubContext,
} from '../../types/types';
import { getUserRepository, getFollowRepository } from '../../database';
import { User } from '../../database/entity/User';
import { isAuthenticated } from '../auth';

const CHECK_FOLLOW = 'CHECK_FOLLOW';

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
    getFollowers: combineResolvers(
      isAuthenticated,
      async (_: any, args: UserId) => {
        const { userId } = args;
        const user = await getUserRepository().validateUserId(userId);
        const followers = await getFollowRepository().getFollowers(user);
        return followers;
      },
    ),

    getFollowing: combineResolvers(
      isAuthenticated,
      async (_: any, args: UserId) => {
        const { userId } = args;
        const user = await getUserRepository().validateUserId(userId);
        const following = await getFollowRepository().getFollowing(user);
        return following;
      },
    ),
  },

  Mutation: {
    followingUser: combineResolvers(
      isAuthenticated,
      async (_: any, args: UserId, context: PubSubContext) => {
        const { userInfo, pubsub } = context;
        const me = await getUserRepository().validateUserId(userInfo.id);
        const { userId } = args;
        const following = await getUserRepository().validateUserId(userId);
        const result = await getFollowRepository().followingUser(me, following);
        const newMe = await getUserRepository().getUserInfo(me);
        if (result) {
          pubsub.publish(`${CHECK_FOLLOW}_${args.userId}`, {
            subscribeRequestFriend: newMe,
          });
        }
        return newMe;
      },
    ),

    checkFollowers: combineResolvers(
      isAuthenticated,
      async (_: any, args: UserIds, { userInfo }) => {
        const me = await getUserRepository().validateUserId(userInfo.id);
        const { userIds } = args;
        const following = await getUserRepository().validateUserIds(userIds);
        await getFollowRepository().checkFollowers(me, following);
        const newMe = await getUserRepository().getUserInfo(me);
        return newMe;
      },
    ),

    deleteFollowing: combineResolvers(
      isAuthenticated,
      async (_: any, args: UserId, { userInfo }) => {
        const me = await getUserRepository().validateUserId(userInfo.id);
        const { userId } = args;
        const following = await getUserRepository().validateUserId(userId);
        await getFollowRepository().deleteFollowing(me, following);
        const newMe = await getUserRepository().getUserInfo(me);
        return newMe;
      },
    ),

    deleteFollower: combineResolvers(
      isAuthenticated,
      async (_: any, args: UserId, { userInfo }) => {
        const me = await getUserRepository().validateUserId(userInfo.id);
        const { userId } = args;
        const follower = await getUserRepository().validateUserId(userId);
        await getFollowRepository().deleteFollower(me, follower);
        const newMe = await getUserRepository().getUserInfo(me);
        return newMe;
      },
    ),
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
    subscribeRequestFriend: {
      subscribe: combineResolvers(
        isAuthenticated,
        (_: any, __: any, context: PubSubContext) => {
          const { userInfo, pubsub } = context;
          return pubsub.asyncIterator(`${CHECK_FOLLOW}_${userInfo.id}`);
        },
      ),
    },
  },
};

export { followResolver };
