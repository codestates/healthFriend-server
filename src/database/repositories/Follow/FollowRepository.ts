import { EntityRepository, Repository } from 'typeorm';

import { ApolloError } from 'apollo-server-express';
import { Follow } from '../../entity/Follow';
import { User } from '../../entity/User';
import { getUserRepository } from '../..';

@EntityRepository(Follow)
export class FollowerRepository extends Repository<Follow> {
  async followingUser(me: User, following: User) {
    if (me.id === following.id) {
      throw new ApolloError('Following id error.', 'FOLLOWING_ID_ERROR');
    }

    await getUserRepository().validateUserId(me.id);
    await getUserRepository().validateUserId(following.id);

    if (await this.isFollower(me, following)) {
      throw new ApolloError(
        'Follower already exist .',
        'FOLLOWER_ALREADY_EXIST',
      );
    }

    const follow = this.create({ following, follower: me });
    const existFollow = await this.findOne(follow);
    if (existFollow) {
      throw new ApolloError(
        'Following already exist.',
        'FOLLOWING_ALREADY_EXIST',
      );
    }

    return this.save(follow);
  }

  async getFollowers(following: User) {
    const followers = await this.find({
      where: { following },
      relations: ['follower', 'following'],
    });
    return followers;
  }

  async getFollowersById(userId: string) {
    const following = await getUserRepository().validateUserId(userId);
    return this.getFollowers(following);
  }

  async getFollowing(follower: User) {
    const followers = await this.find({
      where: { follower },
      relations: ['follower', 'following'],
    });
    return followers;
  }

  async getFollowingById(userId: string) {
    const follower = await getUserRepository().validateUserId(userId);
    return this.getFollowing(follower);
  }

  async getAllFollow(user: User) {
    const followers = await this.getFollowers(user);
    const following = await this.getFollowing(user);
    return [...followers, ...following];
  }

  async deleteFollower(me: User, follower: User) {
    if (me.id === follower.id) return null;

    await getUserRepository().validateUserId(me.id);
    await getUserRepository().validateUserId(follower.id);

    await this.delete({ following: me, follower });
    return this.getFollowers(me);
  }

  async deleteFollowing(me: User, following: User) {
    if (me.id === following.id) return null;

    await getUserRepository().validateUserId(me.id);
    await getUserRepository().validateUserId(following.id);

    await this.delete({ following, follower: me });
    return this.getFollowers(me);
  }

  async checkFollowers(me: User, followers: User[]) {
    const uncheckedFollowers = await this.getUncheckedFollowers(me, followers);
    await this.changeFollowerCheckedToTrue(uncheckedFollowers);
    const follow = await this.getFollowers(me);
    return follow;
  }

  async getUncheckedFollowers(following: User, followers: User[]) {
    const followerIds = followers.map((f) => f.id);
    const results = await this.createQueryBuilder('follow')
      .leftJoinAndSelect('follow.follower', 'user')
      .where('follow.following = :following', { following: following.id })
      .andWhere('follow.checked = false')
      .andWhere('user.id IN (:...followers)', { followers: followerIds })
      .getMany();
    // console.log(results);
    return results;
  }

  async changeFollowerCheckedToTrue(uncheckedFollowers: Follow[]) {
    const results = uncheckedFollowers.map((f) => ({ ...f, checked: true }));
    // console.log(results);
    await this.save(results);
  }

  async isFollower(me: User, follower: User) {
    const followers = (await this.getFollowers(me)).map((f) => f.follower);
    return followers.map((f) => f.id).includes(follower.id);
  }

  async isFollowing(me: User, following: User) {
    const followings = (await this.getFollowing(me)).map((f) => f.following);
    return followings.map((f) => f.id).includes(following.id);
  }

  async getFollowingUserByFollowId(followId: string): Promise<User> {
    const follow = await this.findOne({
      where: { id: followId },
      relations: ['following'],
    });
    if (!follow) {
      throw new ApolloError('Not follow', 'NOT_FOLLOW');
    }
    return follow.following;
  }

  async getFollowerUserByFollowId(followId: string): Promise<User> {
    const follow = await this.findOne({
      where: { id: followId },
      relations: ['follower'],
    });
    if (!follow) {
      throw new ApolloError('Not follow', 'NOT_FOLLOW');
    }
    return follow.follower;
  }

  // 내가 following 하고 있는 사람들
  async batchFollowingUsers(followIds: readonly string[]) {
    const follows = await this.createQueryBuilder('follow')
      .leftJoinAndSelect('follow.follower', 'user')
      .where('follow.id IN (:...followIds)', { followIds })
      .getMany();
    const followMap: { [key: string]: User } = {};
    follows.forEach((u) => {
      followMap[u.id] = u.follower;
    });
    const result = followIds.map((id) => followMap[id]);
    return result;
  }

  // 나의 follower들, 나를 following하고 있는 사람들
  async batchFollowerUsers(followIds: readonly string[]) {
    const follows = await this.createQueryBuilder('follow')
      .leftJoinAndSelect('follow.following', 'user')
      .where('follow.id IN (:...followIds)', { followIds })
      .getMany();
    const followMap: { [key: string]: User } = {};
    follows.forEach((u) => {
      followMap[u.id] = u.following;
    });
    const result = followIds.map((id) => followMap[id]);
    return result;
  }
}
