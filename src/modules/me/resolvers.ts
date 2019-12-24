import { getUserRepository } from '../../utils/connectDB';
import { createMiddleware } from '../../utils/createMiddleware';
import middleware from './middleware';

const resolvers = {
  Query: {
    hello: () => 'Hello World',
    me: createMiddleware(middleware, (_: any, __: any, context: any) =>
      getUserRepository().findByUserId(context.req.userId)),
  },
  Mutation: {
    helloUser: (_: any, { name }: any) => `Hello ${name || 'World'}`,
  },
};

export default resolvers;
