import { combineResolvers } from 'graphql-resolvers';
import Dataloader from 'dataloader';
import { getMotivationRepository, getUserRepository } from '../../database';
import { isAuthenticated } from '../auth';
import { User } from '../../database/entity/User';
import { Motivation } from '../../database/entity/Motivations';

interface MotivationInput {
  input: Motivation;
}

interface MotivationsInput {
  input: Array<Motivation>;
}

interface MotivationId {
  id: string;
}

const usersLoader = new Dataloader<string, User>(
  (motivationIds: readonly string[]) =>
    getMotivationRepository().batchUsers(motivationIds),
  { cache: false },
);

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
      async (_: any, args: MotivationInput) => {
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
      async (_: any, args: MotivationsInput, { userInfo }) => {
        const user = await getUserRepository().validateUserId(userInfo.id);
        const motivations = await getMotivationRepository().saveByUser(
          user,
          args.input,
        );
        return motivations;
      },
    ),
  },

  Motivation: {
    owner: async (motivation: MotivationId) => usersLoader.load(motivation.id),
  },
};

export { motivationResolver };
