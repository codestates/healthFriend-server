import 'reflect-metadata';
import express from 'express';
import { ApolloServer, ApolloError } from 'apollo-server-express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

import connectDB from './database';
import authRouter from './auth/routes';
import passportConfig from './auth';
import schema from './schema';
import { getUserInfoFromToken } from './utils/controllToken';
import { TokenUserInfo } from './types/User.types';

export const startServer = async () => {
  try {
    await connectDB();
    passportConfig();

    const server = new ApolloServer({
      schema,
      context: ({ req }: any) => {
        if (!req.cookies['access-token'] && !req.headers.authorization) {
          // return { userInfo: null };
          throw new ApolloError('Token is required.', 'NO_TOKEN');
        }
        let token: string;
        let userInfo: TokenUserInfo;
        if (req.headers.authorization) {
          token = req.headers.authorization;
          userInfo = getUserInfoFromToken(token.substr(7));
        } else {
          token = req.cookies['access-token'];
          userInfo = getUserInfoFromToken(token);
        }
        // const token: string = req.headers.authorization ;
        // const userInfo = getUserInfoFromToken(token.substr(7));
        return { userInfo };
      },
      introspection: true,
      playground: true,
    });
    const app = express();

    const corsOption = {
      credentials: true,
      origin:
        process.env.NODE_ENV === 'production'
          ? ['https://healthfriend.club', 'http://www.healthfriend.club']
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
    app.listen({ port: 4000 }, () => {
      console.log('Server running at 4000 port');
    });
  } catch (error) {
    console.error(error);
  }
};
