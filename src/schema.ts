import {
  fileLoader,
  mergeResolvers,
  mergeTypes,
} from 'merge-graphql-schemas';
import path from 'path';
import { makeExecutableSchema } from 'graphql-tools';
import { GraphQLSchema } from 'graphql';

const allTypes = fileLoader(path.join(__dirname, './modules/**/typeDefs.ts'));
const allResolvers = fileLoader(
  path.join(__dirname, './modules/**/resolvers.ts'),
);
const schema: GraphQLSchema = makeExecutableSchema({
  typeDefs: mergeTypes(allTypes),
  resolvers: mergeResolvers(allResolvers),
});

export default schema;
