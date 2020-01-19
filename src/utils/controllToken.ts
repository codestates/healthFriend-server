import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { TokenUserInfo } from '../types/types';

export const createToken = (userInfo: TokenUserInfo) => {
  // console.log('createToken: ', userInfo);
  const { id, email, role } = userInfo;
  if (!id || !email || !role) {
    return null;
  }
  const token = jwt.sign(
    {
      id,
      email,
      role,
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRATION_PERIOD,
      issuer: 'Health Friend',
    },
  );
  return token;
};

export const getUserInfoFromToken = (token: string) => {
  const user = jwt.verify(
    token,
    process.env.JWT_SECRET as string,
  ) as TokenUserInfo;
  // console.log('getUserInfoFromToken: ', user);
  return user;
};
