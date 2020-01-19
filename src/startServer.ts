import 'reflect-metadata';
import http from 'http';
import express from 'express';
import {
  ApolloServer,
  makeExecutableSchema,
  PubSub,
  ApolloError,
} from 'apollo-server-express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import { GraphQLSchema } from 'graphql';

import { schemas, resolvers } from './modules';
import connectDB from './database';
import authRouter from './auth/routes';
import passportConfig from './auth';
import { getUserInfoFromToken } from './utils/controllToken';
import { TokenUserInfo } from './types/types';

interface ConnectionParams {
  Authorization: string;
}

export const startServer = async () => {
  try {
    await connectDB();
    passportConfig();

    const pubsub = new PubSub();

    const schema: GraphQLSchema = makeExecutableSchema({
      typeDefs: schemas,
      resolvers,
    });

    const server = new ApolloServer({
      schema,
      context: ({ req, connection }: any) => {
        if (connection && connection.context.userInfo) {
          const { userInfo } = connection.context;
          return { userInfo, pubsub };
        }
        if (!req.cookies['access-token'] && !req.headers.authorization) {
          return { userInfo: null };
        }
        let token: string;
        let userInfo: TokenUserInfo;
        if (req.headers.authorization) {
          token = req.headers.authorization;
          userInfo = getUserInfoFromToken(token.substr(7));
          // console.log(userInfo);
        } else {
          token = req.cookies['access-token'];
          userInfo = getUserInfoFromToken(token);
        }
        // const token: string = req.headers.authorization ;
        // const userInfo = getUserInfoFromToken(token.substr(7));
        return { userInfo, pubsub };
      },
      introspection: true,
      playground: true,
      subscriptions: {
        onConnect: async (connectionParams) => {
          const { Authorization: token } = connectionParams as ConnectionParams;
          if (!token) {
            throw new ApolloError('Missing auth token!');
          }
          const userInfo = getUserInfoFromToken(token.substr(7));
          return { userInfo };
        },
      },
    });
    const PORT = 4000;
    const app = express();

    const corsOption = {
      credentials: true,
      origin:
        process.env.NODE_ENV === 'production'
          ? ['https://healthfriend.club', 'https://www.adminhealthfriend.club']
          : true,
    };
    app.use(passport.initialize());
    app.use(cors(corsOption));
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use('/auth', authRouter);
    app.use('/health', (_, res) => {
      res.status(200).send('health check');
    });

    server.applyMiddleware({ app, cors: false });

    const httpServer = http.createServer(app);
    server.installSubscriptionHandlers(httpServer);
    httpServer.listen(PORT, () => {
      console.log(`Server: http://localhost:${PORT}${server.graphqlPath}`);
      console.log(
        `Subscriptions: ws://localhost:${PORT}${server.subscriptionsPath}`,
      );
    });
  } catch (error) {
    console.error(error);
  }
};
