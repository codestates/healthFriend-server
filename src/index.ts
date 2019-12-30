import 'reflect-metadata';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import https from 'https';
import http from 'http';

import connectDB from './database';
import authRouter from './auth/routes';
import passportConfig from './auth';
import schema from './schema';
import { getUserInfoFromToken } from './utils/controllToken';

const startServer = async () => {
  try {
    const configurations = {
      production: { ssl: true, port: 443, hostname: 'api.healthfriend.com' },
      development: { ssl: false, port: 4000, hostname: 'localhost' },
    };
    const environment = process.env.NODE_ENV || 'production';
    const config = (configurations as any)[environment];

    await connectDB();
    passportConfig();

    const apollo = new ApolloServer({
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

    apollo.applyMiddleware({ app, cors });

    const server = config.ssl
      ? https.createServer(app)
      : http.createServer(app);

    server.listen({ port: config.port }, () =>
      console.log(
        'Server ready at',
        `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${
          apollo.graphqlPath
        }`,
      ));
  } catch (error) {
    console.error(error);
  }
};

startServer();
