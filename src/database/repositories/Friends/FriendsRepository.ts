import { EntityRepository, Repository } from 'typeorm';
import { ApolloError } from 'apollo-server-express';
import { User } from '../../entity/User';
import { Friends } from '../../entity/Friends';
import { getUserRepository, getFollowRepository } from '../..';

@EntityRepository(Friends)
export class FriendsRepository extends Repository<Friends> {
  async addFriend(me: User, friend: User) {
    await getUserRepository().validateUserId(me.id);
    await getUserRepository().validateUserId(friend.id);

    if (await this.isFriend(me, friend)) {
      throw new ApolloError('Already exist user', 'ALREADY_EXIST_USER');
    }

    if (!(await getFollowRepository().isFollower(me, friend))) {
      throw new ApolloError('Not follower', 'NOT_FOLLOWER');
    }

    // transaction 추가
    await getFollowRepository().deleteFollower(me, friend);
    const forward = this.create({ me, friend, checked: true });
    const backward = this.create({ me: friend, friend: me });
    await this.save(backward);
    return this.save(forward);
  }

  async getFriendUserList(user: User) {
    await getUserRepository().validateUserId(user.id);
    const forward = await this.find({
      where: { me: user },
      relations: ['friend'],
    });
    const friends = forward.map((f) => f.friend);
    return friends;
  }

  async getFriends(user: User) {
    // console.log('getFriends: ', user);
    await getUserRepository().validateUserId(user.id);
    const friends = await this.find({
      where: { me: user },
      relations: ['me', 'friend'],
    });
    return friends;
  }

  async getFriendsById(userId: string) {
    const user = await getUserRepository().validateUserId(userId);
    return this.getFriends(user);
  }

  async isFriend(me: User, friend: User) {
    const friends = await this.getFriendUserList(me);
    return friends.map((f) => f.id).includes(friend.id);
  }

  async deleteFriend(me: User, friend: User) {
    await getUserRepository().validateUserId(me.id);
    await getUserRepository().validateUserId(friend.id);
    await this.delete({ me, friend });
    await this.delete({ me: friend, friend: me });
    return this.getFriends(me);
  }

  async checkFriends(me: User, friends: User[]) {
    const uncheckedFriends = await this.getUncheckedFriends(me, friends);
    await this.changeFriendsCheckedToTrue(uncheckedFriends);
    const results = await this.getFriends(me);
    return results;
  }

  async getUncheckedFriends(me: User, friends: User[]) {
    const friendIds = friends.map((f) => f.id);
    const results = await this.createQueryBuilder('friends')
      .leftJoinAndSelect('friends.friend', 'user')
      .where('friends.me = :me', { me: me.id })
      .andWhere('friends.checked = false')
      .andWhere('user.id IN (:...friends)', { friends: friendIds })
      .getMany();
    // console.log('getUncheckedFriends: ', results);
    return results;
  }

  async changeFriendsCheckedToTrue(uncheckedFriends: Friends[]) {
    const results = uncheckedFriends.map((f) => ({ ...f, checked: true }));
    // console.log(results);
    await this.save(results);
  }

  async getMeUserByFriendsId(friendsId: string): Promise<User> {
    const friends = await this.findOne({
      where: { id: friendsId },
      relations: ['me'],
    });
    if (!friends) {
      throw new ApolloError('No friends', 'NO_FRIENDS');
    }
    return friends.me;
  }

  async getFriendUserByFriendsId(friendsId: string): Promise<User> {
    const friends = await this.findOne({
      where: { id: friendsId },
      relations: ['friend'],
    });
    if (!friends) {
      throw new ApolloError('No friends', 'NO_FRIENDS');
    }
    return friends.friend;
  }

  async batchMeUsers(friendIds: readonly string[]) {
    const friends = await this.createQueryBuilder('friends')
      .leftJoinAndSelect('friends.me', 'user')
      .where('friends.id IN (:...friendIds)', { friendIds })
      .getMany();
    const friendsMap: { [key: string]: User } = {};
    friends.forEach((u) => {
      friendsMap[u.id] = u.me;
    });
    return friendIds.map((id) => friendsMap[id]);
  }

  async batchFriendUsers(friendIds: readonly string[]) {
    const friends = await this.createQueryBuilder('friends')
      .leftJoinAndSelect('friends.friend', 'user')
      .where('friends.id IN (:...friendIds)', { friendIds })
      .getMany();
    const friendsMap: { [key: string]: User } = {};
    friends.forEach((u) => {
      friendsMap[u.id] = u.friend;
    });
    return friendIds.map((id) => friendsMap[id]);
  }
}
