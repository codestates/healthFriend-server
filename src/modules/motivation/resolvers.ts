import { AuthenticationError } from 'apollo-server-express';
import { getMotivationRepository } from '../../database';

const resolvers = {
  MotivationEnum: {
    WEIGHT_INCREASE: 'WEIGHT_INCREASE',
    WEIGHT_LOSS: 'WEIGHT_LOSS',
    FIND_FRIEND: 'FIND_FRIEND',
    LONELINESS: 'LONELINESS',
  },

  Query: {
    motivations: async (_: any, args: any, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      if (!args.input) {
        return getMotivationRepository().find();
      }
      return getMotivationRepository().findByMotivation(args.input);
    },
  },

  Mutation: {
    setMotivation: async (_: any, args: any, { userInfo }: any) => {
      if (!userInfo) throw new AuthenticationError('Not authenticated.');
      const motivations = await getMotivationRepository().saveByUserId(
        userInfo.id,
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
