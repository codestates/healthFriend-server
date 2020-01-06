import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

import connectDB from './database';
import authRouter from './auth/routes';
import passportConfig from './auth';
import schema from './schema';
import { getUserInfoFromToken } from './utils/controllToken';

export const startServer = async () => {
  try {
    await connectDB();
    passportConfig();

    const server = new ApolloServer({
      schema,
      context: ({ req }: any) => ({
        userInfo: getUserInfoFromToken(req.cookies['access-token']),
      }),
      introspection: true,
      playground: true,
    });
    const app = express();

    const corsOption = {
      credentials: true,
      origin:
        // eslint-disable-next-line no-nested-ternary
        process.env.NODE_ENV === 'production'
          ? 'https://healthfriend.club'
          : process.env.NODE_ENV === 'doit'
            ? 'https://hf2.doitreviews.com'
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
