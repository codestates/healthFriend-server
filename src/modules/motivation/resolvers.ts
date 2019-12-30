import { getMotivationRepository } from '../../database';

const resolvers = {
  MotivationEnum: {
    WEIGHT_INCREASE: 'WEIGHT_INCREASE',
    WEIGHT_LOSS: 'WEIGHT_LOSS',
    FIND_FRIEND: 'FIND_FRIEND',
    LONELINESS: 'LONELINESS',
  },

  Query: {
    // motivation: async (_: any, args: any) =>
    //   getMotivationRepository().findByUserId(args.userId),
    motivations: async (_: any, args: any) => {
      if (!args.input) {
        return getMotivationRepository().find();
      }
      return getMotivationRepository().findByMotivation(args.input);
    },
  },

  Mutation: {
    setMotivation: async (_: any, args: any, context: any) => {
      if (!context.userInfo && !context.userInfo.id) {
        return null;
      }
      const motivations = await getMotivationRepository().saveByUserId(
        context.userInfo.id,
        args.input,
      );
      return motivations;
    },
  },

  Motivation: {
    owner: async (parent: any) =>
      getMotivationRepository().findUserByMotivationId(parent.id),
  },
};

export default resolvers;
