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
    const expectData = (await getUserRepository().findByUserId(
      user.id,
    )) as User;
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

describe('following/followres test', () => {
  const aaa = usersInfo[0];
  const bbb = usersInfo[1];
  const ccc = usersInfo[2];

  it('aaa가 bbb를 following하면 bbb에 aaa가 follower가 된다.', async () => {
    const userAaa = await getUserRepository().saveUserInfo(aaa);
    const userBbb = await getUserRepository().saveUserInfo(bbb);
    const userCcc = await getUserRepository().saveUserInfo(ccc);

    const userAaa1 = (await getUserRepository().followingUser(
      userAaa.id,
      userBbb.id,
    )) as User;
    // console.log('USER-AAA: ', userAaa);
    // console.log('USER-AAA1: ', userAaa1);
    expect(userAaa1.following).toHaveLength(1);
    expect(userAaa1.following[0].email).toEqual('bbb@gmail.com');
    const userAaa2 = (await getUserRepository().followingUser(
      userAaa.id,
      userCcc.id,
    )) as User;
    // console.log('USER-AAA2: ', userAaa2);
    expect(userAaa2.following).toHaveLength(2);
    expect(userAaa2.following.map((f) => f.email)).toEqual([
      'bbb@gmail.com',
      'ccc@gmail.com',
    ]);
    const userBbb1 = (await getUserRepository().findByUserId(
      userBbb.id,
    )) as User;
    expect(userBbb1.followers[0].email).toEqual('aaa@gmail.com');
    const userCcc1 = (await getUserRepository().findByUserId(
      userCcc.id,
    )) as User;
    expect(userCcc1.followers[0].email).toEqual('aaa@gmail.com');
  });

  it('deleteFollowing test', async () => {
    // deleteFollowing test
    const userAaa = await getUserRepository().saveUserInfo(aaa);
    const userBbb = await getUserRepository().saveUserInfo(bbb);
    const userCcc = await getUserRepository().saveUserInfo(ccc);

    await getUserRepository().followingUser(userAaa.id, userBbb.id);
    await getUserRepository().followingUser(userAaa.id, userCcc.id);
    // console.log(userAaa2);
    const result = (await getUserRepository().deleteFollowing(
      userAaa.id,
      userCcc.id,
    )) as User;
    // console.log('USER-AAA3: ', result);
    expect(result.following).toHaveLength(1);
    expect(result.following[0].email).toEqual('bbb@gmail.com');

    const result2 = (await getUserRepository().deleteFollowing(
      userAaa.id,
      userBbb.id,
    )) as User;
    // console.log('USER-AAA4: ', result2);
    expect(result2.following).toHaveLength(0);

    const userBbb1 = (await getUserRepository().findByUserId(
      userBbb.id,
    )) as User;
    expect(userBbb1.followers).toHaveLength(0);
    const userCcc1 = (await getUserRepository().findByUserId(
      userCcc.id,
    )) as User;
    expect(userCcc1.followers).toHaveLength(0);
  });
});
