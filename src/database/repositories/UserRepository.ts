import { EntityRepository, Repository } from 'typeorm';

import { DetailedUserInfo, RegisterUserInfo } from '../../types/User.types';
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
}
