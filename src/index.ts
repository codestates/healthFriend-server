import 'reflect-metadata';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import passport from 'passport';

import connectDB from './utils/connectDB';
import authRouter from './auth/routes';
import passportConfig from './auth';

const startServer = async () => {
  try {
    const typeDefs = gql`
      type Query {
        hello: String!
      }
      type Mutation {
        helloUser(name: String): String!
      }
    `;

    const resolvers = {
      Query: {
        hello: () => 'Hello World',
      },
      Mutation: {
        helloUser: (_: any, { name }: any) => `Hello ${name || 'World'}`,
      },
    };

    await connectDB();
    passportConfig();

    const server = new ApolloServer({ typeDefs, resolvers });
    const app = express();

    app.use(passport.initialize());
    app.use('/auth', authRouter);

    server.applyMiddleware({ app });
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
