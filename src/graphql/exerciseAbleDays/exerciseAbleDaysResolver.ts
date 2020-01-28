import { combineResolvers } from 'graphql-resolvers';
import Dataloader from 'dataloader';
import {
  getExerciseAbleDaysRepository,
  getUserRepository,
} from '../../database';
import { isAuthenticated } from '../auth';
import { User } from '../../database/entity/User';

const usersLoader = new Dataloader<string, User>(
  (exerciseAbleDaysIds: readonly string[]) =>
    getExerciseAbleDaysRepository().batchUsers(exerciseAbleDaysIds),
  { cache: false },
);

const exerciseAbleDaysResolver = {
  WeekdayEnum: {
    MONDAY: 'MONDAY',
    TUESDAY: 'TUESDAY',
    WEDNESDAY: 'WEDNESDAY',
    THURSDAY: 'THURSDAY',
    FRIDAY: 'FRIDAY',
    SATURDAY: 'SATURDAY',
    SUNDAY: 'SUNDAY',
  },

  Query: {
    exerciseAbleDays: combineResolvers(
      isAuthenticated,
      async (_: any, args: any) => {
        if (!args.input) {
          return getExerciseAbleDaysRepository().find();
        }
        return getExerciseAbleDaysRepository().findByWeekday(args.input);
      },
    ),
  },

  ExerciseAbleDay: {
    user: async (exerciseAbleDay: any) =>
      usersLoader.load(exerciseAbleDay.id),
    // getExerciseAbleDaysRepository().findUserByExerciseAbleDaysId(parent.id),
  },

  Mutation: {
    setExerciseAbleDay: combineResolvers(
      isAuthenticated,
      async (_: any, args: any, { userInfo }) => {
        const user = await getUserRepository().validateUserId(userInfo.id);
        const ableDays = await getExerciseAbleDaysRepository().saveByUser(
          user,
          args.input,
        );
        return ableDays;
      },
    ),
  },
};

export { exerciseAbleDaysResolver };
