import { createMiddleware } from '../../utils/createMiddleware';
import { User } from '../../entity/User';
import middleware from './middleware';

const resolvers = {
  Query: {
    hello: () => 'Hello World',
    me: createMiddleware(
      middleware,
      async (_: any, __: any, context: any) => {
        const { req } = context;
        const user = await User.findOne({ where: { id: req.userId } });
        return user;
      },
    ),
  },
  Mutation: {
    helloUser: (_: any, { name }: any) => `Hello ${name || 'World'}`,
  },
};

export default resolvers;
