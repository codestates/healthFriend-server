import { AuthenticationError } from 'apollo-server-express';
import { UserInfoContext, UserId } from '../../types/types';
import { getUserRepository, getFriendsRepository } from '../../database';

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
      console.log('addFriend - me: ', me);
      const { userId } = args;
      console.log('addFriend - userId: ', userId);
      const friend = await getUserRepository().validateUserId(userId);
      console.log('addFriend - friend: ', friend);
      const meFriend = await getFriendsRepository().addFriend(me, friend);
      return meFriend;
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
    me: async (friends: any) => {
      const meUser = await getFriendsRepository().getMeUserByFriendsId(
        friends.id,
      );
      return meUser;
    },
    friend: async (friends: any) => {
      const friendUser = await getFriendsRepository().getFriendUserByFriendsId(
        friends.id,
      );
      return friendUser;
    },
  },

  Subscription: {
    subscribeAddFriend: () => {},
  },
};

export { friendsResolver };
