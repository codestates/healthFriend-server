import 'reflect-metadata';
import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';

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

const server = new ApolloServer({ typeDefs, resolvers });
const app = express();

server.applyMiddleware({ app });
app.listen({ port: 4000 }, () => {
  console.log(`Server running at http://localhost:4000${server.graphqlPath}`);
});
