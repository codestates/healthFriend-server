import { EntityRepository, Repository } from 'typeorm';

import { Friends } from '../entity/Friends';
import { getUserRepository } from '..';

@EntityRepository(Friends)
export class FriendsRepository extends Repository<Friends> {
  async findByUserId(userId: string) {
    const user = getUserRepository().create({ id: userId });
    const results = await this.find({
      where: { me: user },
      relations: ['friend'],
    });
    const friends = results.map((f) => f.friend);
    // console.log('FriendsRepository - findByUserId: ', friends);
    return friends;
  }

  async isFriend(meId: string, friendId: string) {
    const user = await this.createQueryBuilder('user')
      .andWhere('meId = :meId', { meId })
      .andWhere('friendId = :friendId', { friendId })
      .getOne();
    // console.log('isFriend: ', user);
    return !!user;
  }

  async addFriend(meId: string, friendId: string) {
    const me = await getUserRepository().findByUserId(meId);
    if (!me) {
      return null;
    }
    if (await this.isFriend(meId, friendId)) {
      // console.log('Add friend - aleady exist: ', me);
      return me;
    }
    const followerIdsOfMe: Array<string> = me.followers.map((f) => f.id);
    if (!followerIdsOfMe.includes(friendId)) {
      // console.log('Add friend - not follower: ', me);
      // console.log(friendId, followerIdsOfMe);
      return me;
    }
    const friend = await getUserRepository().findOne({ id: friendId });
    // Friends에서 검색
    // 친구 신청을 받았는지 확인
    // Friends table에 저장
    // follow, following에서 삭제
    await this.save({ me, friend });
    await this.save({ me: friend, friend: me });
    return getUserRepository().deleteFollowers(meId, friendId);
  }

  async deleteFriend(meId: string, friendId: string) {
    const me = getUserRepository().create({ id: meId });
    const friend = getUserRepository().create({ id: friendId });
    await this.delete({ me, friend });
    await this.delete({ me: friend, friend: me });
    const newMe = getUserRepository().findByUserId(meId);
    return newMe;
  }
}
