import { request } from 'graphql-request';
import { Connection } from 'typeorm';
import { AuthenticationError } from 'apollo-server-express';
import axios from 'axios';

import { User } from '../../database/entity/User';
import connectDB, {
  getUserRepository,
} from '../../database';
import { getUserInfoFromToken } from '../../utils/controllToken';
import {
  registerMutation,
  loginQuery,
  userQuery,
  motivationMutation,
} from '../../test/graphql.schema';
import usersInfo from '../../test/initialdata/usersInfo';

let conn: Connection;
beforeAll(async () => {
  conn = await connectDB();
});
afterAll(async () => {
  await conn.close();
});

const host = process.env.TEST_HOST as string;

describe('login Query', () => {
  it('must return a token', async () => {
    const email = 'abcd@gmail.com';
    const password = 'abcd';
    await getUserRepository().deleteUserByEmail(email);
    await request(host, registerMutation(email, password));
    const response = await request(host, loginQuery(email, password));
    // console.log(response);
    const userInfo = getUserInfoFromToken(response.login.token);
    expect(userInfo.email).toEqual(email);
  });
});

describe('user Query', () => {
  it('토큰이 없으면 인증 에러 발생', async () => {
    const email = 'abcd@gmail.com';
    const password = 'abcd';
    await getUserRepository().deleteUserByEmail(email);
    await request(host, registerMutation(email, password));
    const user = (await getUserRepository().findOne({ email })) as User;
    expect(async () =>
      (await request(host, userQuery(user.id))).toThrow(AuthenticationError));
  });

  it('token이 있다면 user info 리턴', async () => {
    await getUserRepository().deleteUserByEmail(usersInfo[1].email);
    const user = await getUserRepository().saveUserInfo(usersInfo[1]);
    // console.log('USER: ', user);

    const expectData = (await getUserRepository().getUserInfo(
      user,
    )) as User;
    // console.log('EXPECT: ', expectData);

    const loginResponse = await request(
      host,
      loginQuery(usersInfo[1].email, usersInfo[1].snsId),
    );
    const { token } = loginResponse.login;
    // console.log(token);

    const userResponse = await axios.post(
      host,
      { query: userQuery(user.id) },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    // console.log('RESULT : ', userResponse.data.data.user);
    const result = userResponse.data.data.user;
    expect(result.email).toEqual(expectData.email);
    expect(result.nickname).toEqual(expectData.nickname);
    expect(result.gender).toEqual(expectData.gender);
    expect(Object.keys(result)).toEqual(
      expect.arrayContaining([
        'id',
        'role',
        'email',
        'nickname',
        'gender',
        'openImageChoice',
        'levelOf3Dae',
        'messageToFriend',
        'motivations',
        'weekdays',
        'ableDistricts',
      ]),
    );
  });
});

describe('user - motivations test', () => {
  it('motivations를 저장 후 user query로 조회할 수 있다.', async () => {
    await getUserRepository().deleteUserByEmail(usersInfo[2].email);
    const user = (await getUserRepository().saveUserInfo(usersInfo[2])) as User;
    const loginResponse = await request(
      host,
      loginQuery(usersInfo[2].email, usersInfo[2].snsId),
    );
    const { token } = loginResponse.login;
    await axios.post(
      host,
      { query: motivationMutation(usersInfo[2].motivations) },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const userResponse = await axios.post(
      host,
      { query: userQuery(user.id) },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const result = userResponse.data.data.user.motivations.map(
      (m: any) => m.motivation,
    );
    expect(result.sort()).toEqual(usersInfo[2].motivations.sort());
  });
});
