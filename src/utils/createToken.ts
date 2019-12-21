import 'dotenv/config';

import jwt from 'jsonwebtoken';

export interface UserInfo {
  id: string,
  email: string,
  nickname: string,
}

export interface Result {
  userId: string,
  email: string,
  nickname: string,
  token: any,
}

const createToken = (userInfo: UserInfo) => {
  const result: Result = {
    userId: userInfo.id,
    email: userInfo.email,
    nickname: userInfo.nickname,
    token: jwt.sign(
      userInfo,
      process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRATION_PERIOD,
        issuer: 'Health Friend',
      },
    ),
  };

  return result;
};

export default createToken;
