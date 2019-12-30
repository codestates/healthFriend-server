import {
  getExerciseAbleDaysRepository,
} from '../../database';

const resolvers = {
  WeekdayEnum: {
    MONDAY: 'Monday',
    TUESDAY: 'Tuesday',
    WEDNESDAY: 'Wednesday',
    THURSDAY: 'Thursday',
    FRIDAY: 'Friday',
    SATURDAY: 'Saturday',
    SUNDAY: 'Sunday',
  },

  Query: {
    exerciseAbleDays: async (_: any, args: any) => {
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
    setExerciseAbleDay: async (_: any, args: any, context:any) => {
      if (!context.userInfo && !context.userInfo.id) {
        return null;
      }
      const ableDays = await getExerciseAbleDaysRepository().saveByUserId(
        context.userInfo.id,
        args.input,
      );
      return ableDays;
    },
  },
};

export default resolvers;
