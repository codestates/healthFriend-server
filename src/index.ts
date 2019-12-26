import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import connectDB from './utils/connectDB';
import authRouter from './auth/routes';
import passportConfig from './auth';
import schema from './schema';
import { getUserInfoFromToken } from './utils/controllToken';

const startServer = async () => {
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

    app.use(passport.initialize());
    app.use(morgan('dev'));
    app.use(cookieParser());
    app.use('/auth', authRouter);
    app.use('/health', (_, res) => {
      res.status(200).send('health check');
    });

    const cors = {
      credentials: true,
      origin: true,
    };

    server.applyMiddleware({ app, cors });
    app.listen({ port: 4000 }, () => {
      console.log(
        `Server running at http://localhost:4000${server.graphqlPath}`,
      );
    });
  } catch (error) {
    console.error(error);
  }
};

startServer();
