import { EntityRepository, Repository } from 'typeorm';

import {
  DetailedUserInfo,
  RegisterUserInfo,
  UserQueryCondition,
} from '../../types/User.types';
import { User } from '../entity/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByUserId(userId: string) {
    const result = await this.findOne({
      where: { id: userId },
      relations: ['motivations'],
    });
    // console.log(result);
    return result;
  }

  async getAllUser() {
    return this.find({});
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
}
