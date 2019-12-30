import { EntityRepository, Repository } from 'typeorm';

import { ExerciseAbleDays } from '../entity/ExerciseAbleDays';
import { User } from '../entity/User';
import { getUserRepository } from '..';

@EntityRepository(ExerciseAbleDays)
export class ExerciseAbleDaysRepository extends Repository<ExerciseAbleDays> {
  async findByUser(user: User) {
    const result = await this.find({ user });
    // console.log('findByUser: ', result);
    return result;
  }

  async findByUserId(userId: string) {
    const user = getUserRepository().create({ id: userId });
    const result = await this.findByUser(user);
    return result;
  }

  async deleteByUser(user: User) {
    return this.delete({ user });
  }

  async saveByUserId(userId: string, ableDays: Array<string>) {
    try {
      const user = getUserRepository().create({ id: userId });
      const objects = ableDays.map((d) => ({ user, weekday: d }));
      await this.deleteByUser(user);
      const results = await this.save(objects);
      // console.log(results);
      return results;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findByWeekday(weekday: string) {
    try {
      // const results = await this.find({ weekday });
      console.log('findByWeekday: ', weekday);
      const results = await this.createQueryBuilder('exercise_able_days')
        .where('weekday IN (:...weekday)', { weekday })
        .getMany();
      // console.log(results);
      return results;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async findUserByExerciseAbleDaysId(exerciseAbleDaysId: string) {
    const result = await this.findOne({
      where: { id: exerciseAbleDaysId },
      relations: ['user'],
    });
    // console.log(result?.owner);
    return result?.user;
  }
}
