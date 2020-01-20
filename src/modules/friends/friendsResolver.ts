import { AuthenticationError } from 'apollo-server-express';
import Dataloader from 'dataloader';
import { UserInfoContext, UserId, UserIds } from '../../types/types';
import { getUserRepository, getFriendsRepository } from '../../database';
import { User } from '../../database/entity/User';

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
    getFriends: async (_: any, __: any, context: UserInfoContext) => {
      const { userInfo } = context;
      if (!userInfo) throw new AuthenticationError('Not authenticated.');

      const user = await getUserRepository().validateUserId(userInfo.id);
      const friends = await getFriendsRepository().getFriends(user);
      return friends;
    },
  },

  Mutation: {
    addFriend: async (_: any, args: UserId, context: UserInfoContext) => {
      const { userInfo } = context;
      if (!userInfo) throw new AuthenticationError('Not authenticated.');

      const me = await getUserRepository().validateUserId(userInfo.id);
      // console.log('addFriend - me: ', me);
      const { userId } = args;
      // console.log('addFriend - userId: ', userId);
      const friend = await getUserRepository().validateUserId(userId);
      // console.log('addFriend - friend: ', friend);
      const meFriend = await getFriendsRepository().addFriend(me, friend);
      return meFriend;
    },

    checkFriends: async (_: any, args: UserIds, context: UserInfoContext) => {
      const { userInfo } = context;
      if (!userInfo) throw new AuthenticationError('Not authenticated.');

      const me = await getUserRepository().validateUserId(userInfo.id);
      const { userIds } = args;
      const friends = await getUserRepository().validateUserIds(userIds);
      await getFriendsRepository().checkFriends(me, friends);
      const newMe = await getUserRepository().getUserInfo(me);
      return newMe;
    },

    deleteFriend: async (_: any, args: UserId, context: UserInfoContext) => {
      const { userInfo } = context;
      if (!userInfo) throw new AuthenticationError('Not authenticated.');

      const me = await getUserRepository().validateUserId(userInfo.id);
      const { userId } = args;
      const friend = await getUserRepository().validateUserId(userId);
      const meFriend = await getFriendsRepository().deleteFriend(me, friend);
      return meFriend;
    },
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
    subscribeAddFriend: () => {},
  },
};

export { friendsResolver };
