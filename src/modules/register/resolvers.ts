import { createToken } from '../../utils/controllToken';
import { getUserRepository } from '../../database';
import { Provider, User } from '../../database/entity/User';
import { RegisterUserInfo, SimpleUserInfo } from '../../types/User.types';

const resolvers = {
  Mutation: {
    registerForTest: async (_: any, args: any) => {
      const userInfo: RegisterUserInfo = {
        email: args.email,
        nickname: args.email,
        provider: Provider.GOOGLE,
        snsId: args.email,
      };
      const user: User = await getUserRepository().saveUserInfo(userInfo);
      const { id, email, nickname } = user as SimpleUserInfo;
      if (!id || !email || !nickname) {
        return null;
      }
      const accessToken = createToken({ id, email, nickname });
      return { token: accessToken };
    },
  },
};

export default resolvers;
