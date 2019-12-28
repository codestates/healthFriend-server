import { EntityRepository, Repository } from 'typeorm';

import { DetailedUserInfo } from '../types/User.types';
import { User } from '../entity/User';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByUserId(userId: string) {
    const result = await this.findOne({
      where: { id: userId },
      relations: ['motivations'],
    });
    console.log(result);
    return result;
  }

  async getAllUser() {
    const where = {};
    return this.find(where);
  }

  async updateUserInfo(userId: string, detailedUserInfo: DetailedUserInfo) {
    const user = new User();
    user.nickname = detailedUserInfo.nickname;
    user.openImageChoice = detailedUserInfo.openImageChoice;
    user.levelOf3Dae = detailedUserInfo.levelOf3Dae;
    user.messageToFriend = detailedUserInfo.messageToFriend;
    await this.manager.update(User, userId, user);
    const updatedUser = (await this.findByUserId(userId)) as User;
    return updatedUser;
  }
}
