import { getMotivationRepository } from '../../utils/connectDB';

const resolvers = {
  MotivationEnum: {
    WEIGHT_INCREASE: '최대 중량 증가',
    WEIGHT_LOSS: '체중 감소',
    FIND_FRIEND: '친구 찾기',
    LONELINESS: '외로움',
  },

  Query: {
    // motivation: async (_: any, args: any) =>
    //   getMotivationRepository().findByUserId(args.userId),
    motivations: async () => getMotivationRepository().find(),
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
