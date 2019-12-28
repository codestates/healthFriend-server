import { EntityRepository, Repository } from 'typeorm';

import { Motivations } from '../entity/Motivations';
import { getUserRepository } from '../database';
import { User } from '../entity/User';

@EntityRepository(Motivations)
export class MotivationsRepository extends Repository<Motivations> {
  async findByUser(user: User) {
    const result = await this.find({ owner: user });
    // console.log('findByUser: ', result);
    return result;
  }

  async findByUserId(userId: string) {
    const user = getUserRepository().create({ id: userId });
    const result = await this.findByUser(user);
    return result;
  }

  async findUserByMotivationId(motivationId: string) {
    const result = await this.findOne({
      where: { id: motivationId },
      relations: ['owner'],
    });
    // console.log(result?.owner);
    return result?.owner;
  }

  async deleteByUser(user: User) {
    return this.delete({ owner: user });
  }

  async saveByUserId(userId: string, motivations: Array<string>) {
    try {
      const user = getUserRepository().create({ id: userId });
      const objects = motivations.map((m) => ({ owner: user, motivation: m }));
      await this.deleteByUser(user);
      return await this.save(objects);
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findByMotivation(motivation: string) {
    try {
      const results = await this.find({ motivation });
      // console.log(results);
      return results;
    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
