import { request } from 'graphql-request';
import { Connection } from 'typeorm';
import { AuthenticationError } from 'apollo-server-express';
import axios from 'axios';

import {
  User,
  Role,
  Gender,
  Provider,
  OpenImageChoice,
  LevelOf3Dae,
} from '../../database/entity/User';
import connectDB, { getUserRepository } from '../../database';
import { getUserInfoFromToken } from '../../utils/controllToken';
import {
  registerMutation,
  loginQuery,
  userQuery,
  motivationMutation,
} from '../../test/graphql.schema';

let conn: Connection;
beforeAll(async () => {
  conn = await connectDB();
});
afterAll(async () => {
  await conn.close();
});

const host = process.env.TEST_HOST as string;

const usersInfo = [
  {
    role: Role.USER,
    email: 'aaa@gmail.com',
    nickname: 'aaa',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '1',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L1,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
      'FIND_FRIEND',
      'LONELINESS',
    ],
    ableDays: [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ],
    districts: [
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'bbb@gmail.com',
    nickname: 'bbb',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '2',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L1,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
      'FIND_FRIEND',
      'LONELINESS',
    ],
    ableDays: ['MONDAY', 'WEDNESDAY', 'THURSDAY', 'SATURDAY', 'SUNDAY'],
    districts: [
      { nameOfDong: '거여1동', idOfGu: 18, nameOfGu: '송파구' },
      { nameOfDong: '거여2동', idOfGu: 18, nameOfGu: '송파구' },
      { nameOfDong: '마천1동', idOfGu: 18, nameOfGu: '송파구' },
      { nameOfDong: '마천2동', idOfGu: 18, nameOfGu: '송파구' },
    ],
  },
  {
    role: Role.USER,
    email: 'ccc@gmail.com',
    nickname: 'ccc',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '3',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L1,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
      'FIND_FRIEND',
      'LONELINESS',
    ],
    ableDays: [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ],
    districts: [
      { nameOfDong: '거여1동', idOfGu: 18, nameOfGu: '송파구' },
      { nameOfDong: '거여2동', idOfGu: 18, nameOfGu: '송파구' },
      { nameOfDong: '마천1동', idOfGu: 18, nameOfGu: '송파구' },
      { nameOfDong: '마천2동', idOfGu: 18, nameOfGu: '송파구' },
    ],
  },
];

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

    const expectData = (await getUserRepository().getUserInfo(user)) as User;
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
    console.log('RESULT : ', userResponse.data.data.user);
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
  it(`motivations를 저장 후 user query로 조회할 수 있다.
      motivations 수정 후 조회할 수 있다.
      (Dataloader cache가 활성화되어 있으면
      수정 전의 데이터가 조회될 수 있으니 주의한다.)`, async () => {
    await getUserRepository().deleteUserByEmail(usersInfo[2].email);
    const userInfo = getUserRepository().create({
      role: usersInfo[2].role,
      email: usersInfo[2].email,
      nickname: usersInfo[2].nickname,
      gender: usersInfo[2].gender,
      provider: usersInfo[2].provider,
      snsId: usersInfo[2].snsId,
      openImageChoice: usersInfo[2].openImageChoice,
      levelOf3Dae: usersInfo[2].levelOf3Dae,
      messageToFriend: 'hello',
    });
    const user = await getUserRepository().save(userInfo);
    // console.log(user);

    const loginResponse = await request(
      host,
      loginQuery(usersInfo[2].email, usersInfo[2].snsId),
    );
    const { token } = loginResponse.login;

    // 최초 저장 후 확인
    // console.log('MOTIVATIONS: ', usersInfo[2].motivations.sort());
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

    // console.log('RESULT: ', result.sort());
    expect(result.sort()).toEqual(usersInfo[2].motivations.sort());

    // 수정 후 확인
    const newMotivations = ['WEIGHT_INCREASE', 'WEIGHT_LOSS'];

    await axios.post(
      host,
      { query: motivationMutation(newMotivations) },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const userResponse2 = await axios.post(
      host,
      { query: userQuery(user.id) },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const result2 = userResponse2.data.data.user.motivations.map(
      (m: any) => m.motivation,
    );

    // console.log('RESULT: ', result2.sort());
    expect(result2.sort()).toEqual(newMotivations.sort());
  });
});
