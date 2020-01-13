import { AuthenticationError } from 'apollo-server-express';
import { getExerciseAbleDaysRepository } from '../../database';

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
    exerciseAbleDays: async (_: any, args: any, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      if (!args.input) {
        return getExerciseAbleDaysRepository().find();
      }
      return getExerciseAbleDaysRepository().findByWeekday(args.input);
    },
  },

  ExerciseAbleDay: {
    user: async (parent: any) =>
      getExerciseAbleDaysRepository().findUserByExerciseAbleDaysId(parent.id),
  },

  Mutation: {
    setExerciseAbleDay: async (_: any, args: any, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      const ableDays = await getExerciseAbleDaysRepository().saveByUserId(
        userInfo.id,
        args.input,
      );
      return ableDays;
    },
  },
};

export { exerciseAbleDaysResolver };
