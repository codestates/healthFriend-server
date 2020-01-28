import { EntityRepository, Repository, getManager } from 'typeorm';
import { ApolloError } from 'apollo-server-express';

import { ExerciseAbleDays, Weekday } from '../../entity/ExerciseAbleDays';
import { User } from '../../entity/User';
import { getUserRepository } from '../..';

@EntityRepository(ExerciseAbleDays)
export class ExerciseAbleDaysRepository extends Repository<ExerciseAbleDays> {
  async deleteByUser(user: User) {
    return this.delete({ user });
  }

  async saveByUser(user: User, ableDays: Array<Weekday>) {
    try {
      const userInstance = await getUserRepository().validateUserId(user.id);
      const objects = ableDays.map((d) =>
        this.create({
          user: userInstance,
          weekday: d,
        }));
      // console.log(results);
      return await getManager().transaction(
        async (transactionalEntityManager) => {
          await transactionalEntityManager.delete(ExerciseAbleDays, {
            user: userInstance,
          });
          await transactionalEntityManager.save(objects);
        },
      );
    } catch (error) {
      // console.log(error);
      throw new ApolloError(
        'Exercise able days save error.',
        'EXERCISE_ABLE_DAY_SAVE_ERROR',
      );
    }
  }

  async findByWeekday(weekday: Weekday) {
    try {
      const results = await this.createQueryBuilder('exercise_able_days')
        .where('weekday IN (:...weekday)', { weekday })
        .getMany();
      return results;
    } catch (error) {
      throw new ApolloError('Find by weekday error', 'FIND_BY_WEEKDAY_ERROR');
    }
  }

  async batchUsers(exerciseAbleDaysId: readonly string[]) {
    const users = await this.createQueryBuilder('exerciseAbleDays')
      .leftJoinAndSelect('exerciseAbleDays.user', 'user')
      .where('exerciseAbleDays.id IN (:...exerciseAbleDaysId)', {
        exerciseAbleDaysId,
      })
      .getMany();
    const userMap: { [key: string]: User } = {};
    users.forEach((u) => {
      userMap[u.id] = u.user;
    });
    return exerciseAbleDaysId.map((id) => userMap[id]);
  }
}
