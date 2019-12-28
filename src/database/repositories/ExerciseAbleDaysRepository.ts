import { EntityRepository, Repository } from 'typeorm';

import { ExerciseAbleDays } from '../entity/ExerciseAbleDays';
import { User } from '../entity/User';

@EntityRepository(ExerciseAbleDays)
export class ExerciseAbleDaysRepository extends Repository<ExerciseAbleDays> {
  async findByUser(user: User) {
    const result = await this.find({ user });
    // console.log('findByUser: ', result);
    return result;
  }
}
