import { combineResolvers } from 'graphql-resolvers';
import { getExerciseAbleDaysRepository } from '../../database';
import { isAuthenticated } from '../auth';

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
    user: async (parent: any) =>
      getExerciseAbleDaysRepository().findUserByExerciseAbleDaysId(parent.id),
  },

  Mutation: {
    setExerciseAbleDay: combineResolvers(
      isAuthenticated,
      async (_: any, args: any, { userInfo }) => {
        const ableDays = await getExerciseAbleDaysRepository().saveByUserId(
          userInfo.id,
          args.input,
        );
        return ableDays;
      },
    ),
  },
};

export { exerciseAbleDaysResolver };
