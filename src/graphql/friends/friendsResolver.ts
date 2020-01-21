import { combineResolvers } from 'graphql-resolvers';
import Dataloader from 'dataloader';
import { UserId, UserIds, PubSubContext } from '../../types/types';
import { getUserRepository, getFriendsRepository } from '../../database';
import { User } from '../../database/entity/User';
import { isAuthenticated } from '../auth';

const ADD_FRIEND = 'ADD_FRIEND';

const meUserLoader = new Dataloader<string, User>(
  (friendIds: readonly string[]) =>
    getFriendsRepository().batchMeUsers(friendIds),
  { cache: false },
);

const friendUserLoader = new Dataloader<string, User>(
  (friendIds: readonly string[]) =>
    getFriendsRepository().batchFriendUsers(friendIds),
  { cache: false },
);

const friendsResolver = {
  Query: {
    getFriends: combineResolvers(
      isAuthenticated,
      async (_: any, __: any, { userInfo }) => {
        const user = await getUserRepository().validateUserId(userInfo.id);
        const friends = await getFriendsRepository().getFriends(user);
        return friends;
      },
    ),
  },

  Mutation: {
    addFriend: combineResolvers(
      isAuthenticated,
      async (_: any, args: UserId, context: PubSubContext) => {
        const { userInfo, pubsub } = context;

        const me = await getUserRepository().validateUserId(userInfo.id);
        // console.log('addFriend - me: ', me);
        const { userId } = args;
        // console.log('addFriend - userId: ', userId);
        const friend = await getUserRepository().validateUserId(userId);
        // console.log('addFriend - friend: ', friend);
        const meFriend = await getFriendsRepository().addFriend(me, friend);
        const newMe = await getUserRepository().getUserInfo(me);
        if (meFriend) {
          pubsub.publish(`${ADD_FRIEND}_${args.userId}`, {
            subscribeAddFriend: newMe,
          });
        }
        return newMe;
      },
    ),

    checkFriends: combineResolvers(
      isAuthenticated,
      async (_: any, args: UserIds, { userInfo }) => {
        const me = await getUserRepository().validateUserId(userInfo.id);
        const { userIds } = args;
        const friends = await getUserRepository().validateUserIds(userIds);
        await getFriendsRepository().checkFriends(me, friends);
        const newMe = await getUserRepository().getUserInfo(me);
        return newMe;
      },
    ),

    deleteFriend: combineResolvers(
      isAuthenticated,
      async (_: any, args: UserId, { userInfo }) => {
        const me = await getUserRepository().validateUserId(userInfo.id);
        const { userId } = args;
        const friend = await getUserRepository().validateUserId(userId);
        await getFriendsRepository().deleteFriend(me, friend);
        const newMe = await getUserRepository().getUserInfo(me);
        return newMe;
      },
    ),
  },

  Friends: {
    me: async (friends: any) => meUserLoader.load(friends.id),
    // {
    //   const meUser = await getFriendsRepository().getMeUserByFriendsId(
    //     friends.id,
    //   );
    //   return meUser;
    // },
    friend: async (friends: any) => friendUserLoader.load(friends.id),
    // {
    //   const friendUser =
    // await getFriendsRepository().getFriendUserByFriendsId(
    //     friends.id,
    //   );
    //   return friendUser;
    // },
  },

  Subscription: {
    subscribeAddFriend: {
      subscribe: combineResolvers(
        isAuthenticated,
        (_: any, __: any, context: PubSubContext) => {
          const { userInfo: me, pubsub } = context;
          return pubsub.asyncIterator(`${ADD_FRIEND}_${me.id}`);
        },
      ),
    },
  },
};

export { friendsResolver };
