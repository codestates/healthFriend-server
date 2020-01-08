import { EntityRepository, Repository } from 'typeorm';

import { createToken } from '../../utils/controllToken';
import {
  DetailedUserInfo,
  RegisterUserInfo,
  UserQueryCondition,
  LoginInfo,
} from '../../types/User.types';
import { User } from '../entity/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByUserId(userId: string) {
    const result = await this.findOne({
      where: { id: userId },
      relations: ['following', 'followers', 'friends'],
    });
    // console.log(result);
    return result;
  }

  async getAllUser() {
    return this.find({ relations: ['following', 'followers', 'friends'] });
  }

  async updateUserInfo(userId: string, detailedUserInfo: DetailedUserInfo) {
    const user = this.create({
      id: userId,
      nickname: detailedUserInfo.nickname,
      gender: detailedUserInfo.gender,
      openImageChoice: detailedUserInfo.openImageChoice,
      levelOf3Dae: detailedUserInfo.levelOf3Dae,
      messageToFriend: detailedUserInfo.messageToFriend,
    });
    await this.save(user);
    const updatedUser = (await this.findByUserId(userId)) as User;
    return updatedUser;
  }

  async saveUsersInfo(UsersInfo: Array<RegisterUserInfo>) {
    const objects = UsersInfo.map((user) =>
      this.create({
        role: user.role,
        email: user.email,
        nickname: user.nickname,
        provider: user.provider,
        snsId: user.snsId,
      }));
    return this.save(objects);
  }

  async filterUsers(whereObject: UserQueryCondition) {
    const users = await this.createQueryBuilder('user')
      .innerJoinAndSelect('user.motivations', 'motivation')
      .innerJoinAndSelect('user.ableDays', 'ableDay')
      .innerJoinAndSelect('user.ableDistricts', 'district')
      .andWhere(
        whereObject.gender.length
          ? 'user.gender IN (:...gender)'
          : '1=1',
        { gender: whereObject.gender },
      )
      .andWhere(
        whereObject.openImageChoice.length
          ? 'user.openImageChoice IN (:...openImageChoice)'
          : '1=1',
        { openImageChoice: whereObject.openImageChoice },
      )
      .andWhere(
        whereObject.levelOf3Dae.length
          ? 'user.levelOf3Dae IN (:...levelOf3Dae)'
          : '1=1',
        { levelOf3Dae: whereObject.levelOf3Dae },
      )
      .andWhere(
        whereObject.motivations.length
          ? 'motivation IN (:...motivations)'
          : '1=1',
        { motivations: whereObject.motivations },
      )
      .andWhere(
        whereObject.weekdays.length ? 'weekday IN (:...weekdays)' : '1=1',
        { weekdays: whereObject.weekdays },
      )
      .andWhere(
        whereObject.districts.length
          ? 'districtIdOfDong IN (:...districts)'
          : '1=1',
        { districts: whereObject.districts },
      )
      .getMany();
    return users;
  }

  async followingUser(meId: string, userId: string) {
    if (meId === userId) {
      return null;
    }

    const me = await this.findByUserId(meId);
    if (!me) {
      // console.log('FollowingUser - Not exist ME!!!');
      return null;
    }

    const followingIds: Array<string> = me.following.map((f) => f.id);
    if (followingIds.includes(userId)) {
      // console.log('FollowingUser - alreay exist: ', me);
      return me;
    }

    const user = await this.findOne({ id: userId });
    if (user) {
      me.following.push(user);
      await this.save(me);
    }
    return me;
  }

  async deleteFollowing(meId: string, userId: string) {
    const me = await this.findByUserId(meId);
    if (!me) {
      return null;
    }
    me.following = me.following.filter((f) => f.id !== userId);
    this.save(me);
    return me;
  }

  async deleteFollowers(meId: string, userId: string) {
    const me = await this.findByUserId(meId);
    if (!me) {
      return null;
    }
    me.followers = me.followers.filter((f) => f.id !== userId);
    this.save(me);
    return me;
  }

  async saveUserInfo(UserInfo: RegisterUserInfo) {
    return this.save(UserInfo);
  }

  async deleteUserByEmail(email: string) {
    const user = this.create({ email });
    await this.delete(user);
  }

  async login(loginInfo: LoginInfo) {
    const user = await this.findOne({ where: { email: loginInfo.email } });
    if (!user) {
      return null;
    }
    if (user.snsId !== loginInfo.password) {
      return null;
    }
    // console.log('LOGIN: ', user);
    const token = createToken(user);
    return { token };
  }
}
