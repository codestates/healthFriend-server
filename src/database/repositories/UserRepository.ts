import { EntityRepository, Repository } from 'typeorm';
import { ApolloError } from 'apollo-server-express';

import { createToken } from '../../utils/controllToken';
import {
  DetailedUserInfo,
  RegisterUserInfo,
  UserQueryCondition,
  LoginInfo,
} from '../../types/User.types';
import { User } from '../entity/User';
import { Motivations } from '../entity/Motivations';
import { ExerciseAbleDays } from '../entity/ExerciseAbleDays';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async test() {
    throw new ApolloError('User select error.', 'SERVER_ERROR');
  }

  async findByUserId(userId: string) {
    try {
      const result = await this.findOne({
        where: { id: userId },
        relations: ['following', 'followers', 'friends'],
      });
      return result;
    } catch (error) {
      throw new ApolloError('User select error.', 'SERVER_ERROR');
    }
  }

  async getAllUser() {
    try {
      return this.find({ relations: ['following', 'followers', 'friends'] });
    } catch (error) {
      throw new ApolloError('User select error.', 'SERVER_ERROR');
    }
  }

  async updateUserInfo(userId: string, detailedUserInfo: DetailedUserInfo) {
    try {
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

  async followingUser(meId: string, userId: string) {
    try {
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
        return null;
      }

      const user = await this.findOne({ id: userId });
      if (user) {
        me.following.push(user);
        return await this.save(me);
      }
      return null;
    } catch (error) {
      throw new ApolloError('Following error.', 'SERVER_ERROR');
    }
  }

  async deleteFollowing(meId: string, userId: string) {
    try {
      const me = await this.findByUserId(meId);
      if (!me) {
        return null;
      }
      me.following = me.following.filter((f) => f.id !== userId);
      return await this.save(me);
    } catch (error) {
      throw new ApolloError('Following delete error.', 'SERVER_ERROR');
    }
  }

  async deleteFollowers(meId: string, userId: string) {
    try {
      const me = await this.findByUserId(meId);
      if (!me) {
        return null;
      }
      me.followers = me.followers.filter((f) => f.id !== userId);
      return await this.save(me);
    } catch (error) {
      throw new ApolloError('Follow delete error.', 'SERVER_ERROR');
    }
  }

  async saveUserInfo(UserInfo: RegisterUserInfo) {
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
      const token = createToken(user);
      return { token, user };
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
}
