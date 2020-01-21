import { combineResolvers } from 'graphql-resolvers';
import { getMotivationRepository } from '../../database';
import { isAuthenticated } from '../auth';

const motivationResolver = {
  MotivationEnum: {
    WEIGHT_INCREASE: 'WEIGHT_INCREASE',
    WEIGHT_LOSS: 'WEIGHT_LOSS',
    FIND_FRIEND: 'FIND_FRIEND',
    LONELINESS: 'LONELINESS',
  },

  Query: {
    motivations: combineResolvers(
      isAuthenticated,
      async (_: any, args: any) => {
        if (!args.input) {
          return getMotivationRepository().find();
        }
        return getMotivationRepository().findByMotivation(args.input);
      },
    ),
  },

  Mutation: {
    setMotivation: combineResolvers(
      isAuthenticated,
      async (_: any, args: any, { userInfo }) => {
        const motivations = await getMotivationRepository().saveByUserId(
          userInfo.id,
          args.input,
        );
        return motivations;
      },
    ),
  },

  Motivation: {
    owner: async (parent: any) =>
      getMotivationRepository().findUserByMotivationId(parent.id),
  },
};

export { motivationResolver };
