import { AuthenticationError } from 'apollo-server-express';
import { skip } from 'graphql-resolvers';
import { UserInfoContext } from '../types/types';

export const isAuthenticated = (_: any, __: any, context: UserInfoContext) => {
  const { userInfo } = context;
  return userInfo
    ? skip
    : new AuthenticationError('Not authenticated as user.');
};
