import { EntityRepository, Repository, getManager } from 'typeorm';
import { ApolloError } from 'apollo-server-express';

import { Motivations, Motivation } from '../../entity/Motivations';
import { User } from '../../entity/User';

@EntityRepository(Motivations)
export class MotivationsRepository extends Repository<Motivations> {
  async deleteByUser(user: User) {
    return this.delete({ owner: user });
  }

  async saveByUser(user: User, motivations: Array<Motivation>) {
    try {
      const objects = motivations.map((m) =>
        this.create({ owner: user, motivation: m }));
      return await getManager().transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.delete(Motivations, { owner: user });
          await transactionalEntityManager.save(objects);
        },
      );
    } catch (error) {
      // console.log(error);
      throw new ApolloError('Motivation save error.', 'MOTIVATION_SAVE_ERROR');
    }
  }

  async findByMotivation(motivation: string) {
    try {
      const results = await this.find({ motivation });
      return results;
    } catch (error) {
      // console.log(error);
      throw new ApolloError('Motivation find error.', 'MOTIVATION_FIND_ERROR');
    }
  }

  async batchUsers(motivationIds: readonly string[]) {
    const users = await this.createQueryBuilder('motivations')
      .leftJoinAndSelect('motivations.owner', 'user')
      .where('motivations.id IN (:...motivationIds)', {
        motivationIds,
      })
      .getMany();
    const userMap: { [key: string]: User } = {};
    users.forEach((u) => {
      userMap[u.id] = u.owner;
    });
    return motivationIds.map((id) => userMap[id]);
  }
}
