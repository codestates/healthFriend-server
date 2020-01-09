import { request } from 'graphql-request';
import { Connection } from 'typeorm';
import { User } from '../../database/entity/User';
import connectDB, { getUserRepository } from '../../database';
import { getUserInfoFromToken } from '../../utils/controllToken';
import {
  registerMutation,
  loginQuery,
  userQuery,
} from '../../test/graphql.schema';
import usersInfo from '../../test/initialdata/usersInfo';
// import { TestUser, saveDistrict } from '../../test/initialdata/insertData';
// import { saveDistrict } from '../../test/initialdata/insertData';

let conn: Connection;
beforeAll(async () => {
  conn = await connectDB();
});
afterAll(async () => {
  await conn.close();
});

describe('login Query', () => {
  it('must return a token', async () => {
    const email = 'abcd@gmail.com';
    const password = 'abcd';
    getUserRepository().deleteUserByEmail(email);
    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password),
    );
    const response = await request(
      process.env.TEST_HOST as string,
      loginQuery(email, password),
    );
    // console.log(response);
    const userInfo = getUserInfoFromToken(response.login.token);
    expect(userInfo.email).toEqual(email);
  });
});

describe('user Query', () => {
  it('return a user info', async () => {
    // await saveDistrict();
    await getUserRepository().deleteUserByEmail(usersInfo[1].email);
    const user = await getUserRepository().saveUserInfo(usersInfo[1]);
    const expectData = await getUserRepository().findByUserId(user.id) as User;
    const response = await request(
      process.env.TEST_HOST as string,
      userQuery(user.id),
    );
    // console.log(expectData);
    // console.log('RESPONSE: ', response);
    expect(response.user.email).toEqual(expectData.email);
    expect(response.user.nickname).toEqual(expectData.nickname);
    expect(response.user.gender).toEqual(expectData.gender);
    expect(Object.keys(response.user)).toEqual(
      expect.arrayContaining([
        'id',
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
