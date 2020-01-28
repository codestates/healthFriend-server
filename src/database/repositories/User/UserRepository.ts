import { EntityRepository, Repository } from 'typeorm';
import { ApolloError } from 'apollo-server-express';
import { StreamChat } from 'stream-chat';

import { createToken } from '../../../utils';
import {
  RegisterUserInfo,
  UserQueryCondition,
  LoginInfo,
} from '../../../types/types';
import { User } from '../../entity/User';
import { Motivations } from '../../entity/Motivations';
import { ExerciseAbleDays } from '../../entity/ExerciseAbleDays';
import { AbleDistricts } from '../../entity/AbleDistricts';
import { Image } from '../../entity/Image';
import { Follow } from '../../entity/Follow';
import { Friends } from '../../entity/Friends';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async test() {
    throw new ApolloError(
      '**TEST** User select error. **TEST**',
      'SERVER_ERROR',
    );
  }

  async getUserInfo(user: User) {
    try {
      const result = await this.findOne({ id: user.id });
      if (!result) {
        throw new ApolloError('User select error.', 'SERVER_ERROR');
      }
      return result;
    } catch (error) {
      throw new ApolloError('User select error.', 'SERVER_ERROR');
    }
  }

  async getUserInfoById(userId: string) {
    const result = await this.findOne({ id: userId });
    // console.log('getUserInfoById: ', result);
    if (!result) {
      throw new ApolloError('User select error.', 'SERVER_ERROR');
    }
    return result;
  }

  async getAllUser() {
    try {
      return await this.find();
    } catch (error) {
      throw new ApolloError('User select error.', 'SERVER_ERROR');
    }
  }

  async getUserCount() {
    const count = await this.count();
    // console.log(count);
    return count;
  }

  async validateUserId(userId: string) {
    const user = await this.findOne({ id: userId });
    if (!user) {
      throw new ApolloError('No user', 'NO_USER');
    }
    return user;
  }

  async validateUserIds(userIds: string[]) {
    const users = await this.findByIds(userIds);
    if (!users) {
      throw new ApolloError('No user', 'NO_USER');
    }
    return users;
  }

  async updateUserInfo(user: User) {
    try {
      // update 한 정보만 return 한다. select가 필요하다.
      await this.save(user);
      return await this.getUserInfo(user);
    } catch (error) {
      throw new ApolloError('User update error.', 'SERVER_ERROR');
    }
  }

  async saveUsersInfo(UsersInfo: Array<RegisterUserInfo>) {
    // 초기 데이터 입력 용도로만 사용
    try {
      const objects = UsersInfo.map((user) =>
        this.create({
          role: user.role,
          email: user.email,
          nickname: user.nickname,
          provider: user.provider,
          snsId: user.snsId,
        }));
      return this.save(objects);
    } catch (error) {
      throw new ApolloError('User info save error.', 'SERVER_ERROR');
    }
  }

  async filterUsers(whereObject: UserQueryCondition) {
    try {
      const users = await this.createQueryBuilder('user')
        .innerJoinAndSelect('user.motivations', 'motivation')
        .innerJoinAndSelect('user.ableDays', 'ableDay')
        .innerJoinAndSelect('user.ableDistricts', 'district')
        .andWhere(
          whereObject.gender.length ? 'user.gender IN (:...gender)' : '1=1',
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
    } catch (error) {
      throw new ApolloError('User info filtering error.', 'SERVER_ERROR');
    }
  }

  async saveUserInfo(UserInfo: RegisterUserInfo) {
    // 테스트 용도로만 사용
    try {
      return await this.save(UserInfo);
    } catch (error) {
      throw new ApolloError('User save error.', 'SERVER_ERROR');
    }
  }

  async deleteUserByEmail(email: string) {
    // 테스트 용도로만 사용
    try {
      const user = this.create({ email });
      await this.delete(user);
    } catch (error) {
      throw new ApolloError('User delete error.', 'SERVER_ERROR');
    }
  }

  async login(loginInfo: LoginInfo) {
    try {
      const user = await this.findOne({ where: { email: loginInfo.email } });
      if (!user) {
        return null;
      }
      if (user.snsId !== loginInfo.password) {
        return null;
      }
      // console.log('LOGIN: ', user);
      const loginToken = createToken(user);
      const client = new StreamChat('', process.env.STREAM_CHAT_SECRET);
      const chatToken = client.createToken(user.id);
      return { user, loginToken, chatToken };
    } catch (error) {
      throw new ApolloError('User login error.', 'SERVER_ERROR');
    }
  }

  async batchMotivations(userIds: readonly string[]) {
    const users = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.motivations', 'motivations')
      .where('user.id IN (:...userIds)', { userIds })
      .getMany();
    const userMap: { [key: string]: Motivations[] } = {};
    users.forEach((u) => {
      userMap[u.id] = u.motivations;
    });
    const result = userIds.map((id) => userMap[id]);
    return result;
  }

  async batchExerciseAbleDays(userIds: readonly string[]) {
    const users = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.ableDays', 'ableDays')
      .where('user.id IN (:...userIds)', { userIds })
      .getMany();
    const userMap: { [key: string]: ExerciseAbleDays[] } = {};
    users.forEach((u) => {
      userMap[u.id] = u.ableDays;
    });
    return userIds.map((id) => userMap[id]);
  }

  async batchAbleDistricts(userIds: readonly string[]) {
    const users = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.ableDistricts', 'ableDistricts')
      .where('user.id IN (:...userIds)', { userIds })
      .getMany();
    const userMap: { [key: string]: AbleDistricts[] } = {};
    users.forEach((u) => {
      userMap[u.id] = u.ableDistricts;
    });
    return userIds.map((id) => userMap[id]);
  }

  async batchImages(userIds: readonly string[]) {
    const users = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.images', 'image')
      .where('user.id IN (:...userIds)', { userIds })
      .getMany();
    const userMap: { [key: string]: Image[] } = {};
    users.forEach((u) => {
      userMap[u.id] = u.images;
    });
    return userIds.map((id) => userMap[id]);
  }

  async batchFriends(userIds: readonly string[]) {
    const users = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.friends', 'friends')
      .where('user.id IN (:...userIds)', { userIds })
      .getMany();
    const userMap: { [key: string]: Friends[] } = {};
    users.forEach((u) => {
      userMap[u.id] = u.friends;
    });
    const result = userIds.map((id) => userMap[id]);
    return result;
  }

  // 내가 following 하고 있는 사람들
  // 내가 follower에 저장되어 있는 follow를 찾으면 내 following을 찾을 수 있다.
  async batchFollowing(userIds: readonly string[]) {
    const users = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.followers', 'follow')
      .where('user.id IN (:...userIds)', { userIds })
      .getMany();
    const userMap: { [key: string]: Follow[] } = {};
    users.forEach((u) => {
      userMap[u.id] = u.followers;
    });
    const result = userIds.map((id) => userMap[id]);
    return result;
  }

  // 나의 follower들, 나를 following하고 있는 사람들
  // 내가 following인 것을 찾으면 follower를 찾을 수 있다.
  async batchFollowers(userIds: readonly string[]) {
    const users = await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.following', 'follow')
      .where('user.id IN (:...userIds)', { userIds })
      .getMany();
    const userMap: { [key: string]: Follow[] } = {};
    users.forEach((u) => {
      userMap[u.id] = u.following;
    });
    const result = userIds.map((id) => userMap[id]);
    return result;
  }
}
