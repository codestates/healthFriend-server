import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { SimpleUserInfo } from '../types/User.types';

export const createToken = (userInfo: SimpleUserInfo) => {
  const token = jwt.sign(userInfo, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRATION_PERIOD,
    issuer: 'Health Friend',
  });
  return token;
};

export const getUserInfoFromToken = (token: string) => {
  const user = jwt.verify(
    token,
    process.env.JWT_SECRET as string,
  ) as SimpleUserInfo;
  return user;
};
