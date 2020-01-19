import { Connection } from 'typeorm';
import { ApolloError } from 'apollo-server-express';
import connectDB, { getUserRepository } from '../..';
import {
  Role,
  Provider,
  User,
  Gender,
  OpenImageChoice,
  LevelOf3Dae,
} from '../../entity/User';

let conn: Connection;
beforeEach(async () => {
  conn = await connectDB();
});
afterEach(async () => {
  await conn.close();
});

const aaaUser = {
  role: Role.USER,
  email: 'aaa@gmail.com',
  nickname: 'aaa',
  provider: Provider.GOOGLE,
  snsId: '1',
};

const bbbUser = {
  role: Role.USER,
  email: 'bbb@gmail.com',
  nickname: 'bbb',
  provider: Provider.GOOGLE,
  snsId: '2',
};

const cccUser = {
  role: Role.USER,
  email: 'ccc@gmail.com',
  nickname: 'ccc',
  provider: Provider.GOOGLE,
  snsId: '3',
};

describe('User test', () => {
  it('user 정보를 조회할 수 있다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUser);
    const aaaUserInfo = (await getUserRepository().getUserInfo(aaa)) as User;
    // console.log(aaaUserInfo);
    expect(Object.keys(aaaUserInfo)).toEqual(
      expect.arrayContaining([
        'id',
        'role',
        'email',
        'nickname',
        'provider',
        'snsId',
      ]),
    );
  });

  it('userId가 없으면 ApolloError 리턴', async () => {
    await expect(
      getUserRepository().getUserInfo(aaaUser as User),
    ).rejects.toThrow(ApolloError);
  });

  it('다수의 user를 조회할 수 있다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUser);
    const bbb = await getUserRepository().saveUserInfo(bbbUser);
    const ccc = await getUserRepository().saveUserInfo(cccUser);
    const allUser = await getUserRepository().getAllUser();
    // console.log(follow);
    expect(allUser).toHaveLength(3);
    expect(allUser.map((u) => u.email).sort()).toEqual([
      aaa.email,
      bbb.email,
      ccc.email,
    ]);
  });

  it('user 정보를 수정할 수 있다.', async () => {
    const aaa = (await getUserRepository().saveUserInfo(aaaUser)) as User;
    const expectUserData = getUserRepository().create({
      id: aaa.id,
      nickname: 'abc',
      gender: Gender.FEMALE,
      openImageChoice: OpenImageChoice.CLOSE,
      levelOf3Dae: LevelOf3Dae.L2,
      messageToFriend: 'hello',
    });
    const savedUserData = await getUserRepository().updateUserInfo(
      expectUserData,
    );
    expect(savedUserData.id).toEqual(aaa.id);
    expect(savedUserData.nickname).toEqual(expectUserData.nickname);
    expect(savedUserData.gender).toEqual(expectUserData.gender);
    expect(savedUserData.openImageChoice).toEqual(
      expectUserData.openImageChoice,
    );
    expect(savedUserData.levelOf3Dae).toEqual(expectUserData.levelOf3Dae);
    expect(savedUserData.messageToFriend).toEqual(
      expectUserData.messageToFriend,
    );
  });

  // async function throws () {
  //   throw new Error('hello world')
  // }
  // test('promise throws', async () => {
  //   await expect(throws()).rejects.toThrow()
  // })

  it('없는 user의 정보를 확인하려고 하면 ApolloError를 리턴한다.', async () => {
    const noUser = getUserRepository().create({ id: 'noUser' });
    await expect(getUserRepository().validateUserId(noUser.id)).rejects.toThrow(
      ApolloError,
    );
  });
});
