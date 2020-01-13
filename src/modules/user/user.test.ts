import { request } from 'graphql-request';
import { Connection } from 'typeorm';
import { AuthenticationError } from 'apollo-server-express';
import axios from 'axios';

import { User } from '../../database/entity/User';
import connectDB, {
  getUserRepository,
  getFriendsRepository,
  // getMotivationRepository,
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

    const expectData = (await getUserRepository().findByUserId(
      user.id,
    )) as User;
    // console.log('EXPECT: ', expectData);

    const loginResponse = await request(
      host,
      loginQuery(usersInfo[1].email, usersInfo[1].snsId),
    );
    const { token } = loginResponse.login;

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

describe('addFriend test', () => {
  const aaa = usersInfo[6];
  const bbb = usersInfo[7];
  const ccc = usersInfo[8];
  // const ddd = usersInfo[3];
  // const eee = usersInfo[4];

  it('aaa가 bbb를 following하면 bbb에 aaa가 addFriend한다.', async () => {
    const userAaa = await getUserRepository().saveUserInfo(aaa);
    const userBbb = await getUserRepository().saveUserInfo(bbb);
    const userCcc = await getUserRepository().saveUserInfo(ccc);

    // following 1개
    const userAaa1 = (await getUserRepository().followingUser(
      userAaa.id,
      userBbb.id,
    )) as User;
    expect(userAaa1.following).toHaveLength(1);
    expect(userAaa1.following[0].email).toEqual(userBbb.email);

    // following 2개
    const userAaa2 = (await getUserRepository().followingUser(
      userAaa.id,
      userCcc.id,
    )) as User;
    // console.log('USER-AAA2: ', userAaa2);
    expect(userAaa2.following).toHaveLength(2);
    expect(userAaa2.following.map((f) => f.email)).toEqual([
      userBbb.email,
      userCcc.email,
    ]);

    // userBbb가 userAaa를 친구 추가
    const userBbb1 = await getFriendsRepository().addFriend(
      userBbb.id,
      userAaa.id,
    ) as User;
    const friends = await getFriendsRepository().findByUserId(userBbb.id);
    console.log(friends);
    expect(friends.map((f) => f.id)).toEqual([userAaa.id]);

    // 친구 추가가 성공하면 follower에서 userAaa는 삭제된다.
    console.log(userBbb1);
    expect(userBbb1.followers.map((f) => f.id)).not.toEqual(
      expect.arrayContaining([userAaa.id]),
    );

    // const userAaa3 = await getUserRepository().findByUserId(userAaa.id);
    // console.log(userAaa3);
    // const userCcc1 = (await getUserRepository().findByUserId(
    //   userCcc.id,
    // )) as User;
    // expect(userCcc1.followers[0].email).toEqual('aaa@gmail.com');
  });
});
