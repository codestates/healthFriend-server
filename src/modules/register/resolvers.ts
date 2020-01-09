import { createToken } from '../../utils/controllToken';
import { getUserRepository } from '../../database';
import { Provider, User, Role } from '../../database/entity/User';
import {
  RegisterUserInfo,
  LoginInfo,
} from '../../types/User.types';

const resolvers = {
  Mutation: {
    registerForTest: async (_: any, args: LoginInfo) => {
      const userInfo: RegisterUserInfo = {
        role: Role.USER,
        email: args.email,
        nickname: args.email,
        provider: Provider.GOOGLE,
        snsId: args.password,
      };
      const user: User = await getUserRepository().saveUserInfo(userInfo);
      // console.log('registerForTest: ', user);
      const accessToken = createToken(user);
      return { token: accessToken, user };
    },
  },
};

export default resolvers;
