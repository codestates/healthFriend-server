import 'dotenv/config';
import jwt from 'jsonwebtoken';

export interface UserInfo {
  id: string,
  email: string,
  nickname: string,
}

const createToken = (userInfo: UserInfo) => {
  const token = jwt.sign(
    userInfo,
    process.env.JWT_SECRET as string, {
      expiresIn: process.env.JWT_EXPIRATION_PERIOD,
      issuer: 'Health Friend',
    },
  );
  return token;
};

export default createToken;
