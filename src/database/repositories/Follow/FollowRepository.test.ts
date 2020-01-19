import { Connection } from 'typeorm';
import { ApolloError } from 'apollo-server-express';
import connectDB, { getUserRepository, getFollowRepository } from '../..';
import { Role, Provider } from '../../entity/User';
import { Follow } from '../../entity/Follow';

let conn: Connection;
beforeEach(async () => {
  conn = await connectDB();
});
afterEach(async () => {
  await conn.close();
});

const aaaUserInfo = {
  role: Role.USER,
  email: 'aaa@gmail.com',
  nickname: 'aaa',
  provider: Provider.GOOGLE,
  snsId: '1',
};

const bbbUserInfo = {
  role: Role.USER,
  email: 'bbb@gmail.com',
  nickname: 'bbb',
  provider: Provider.GOOGLE,
  snsId: '2',
};

const cccUserInfo = {
  role: Role.USER,
  email: 'ccc@gmail.com',
  nickname: 'ccc',
  provider: Provider.GOOGLE,
  snsId: '3',
};

const dddUserInfo = {
  role: Role.USER,
  email: 'ddd@gmail.com',
  nickname: 'ddd',
  provider: Provider.GOOGLE,
  snsId: '4',
};

describe('following test', () => {
  it('aaa가 bbb를 following 하면, 리턴값을 aaa의 Follow instance다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    const follow = (await getFollowRepository().followingUser(
      aaa,
      bbb,
    )) as Follow;
    // console.log(follow);
    expect(follow.follower.email).toEqual(aaa.email);
    expect(follow.following.email).toEqual(bbb.email);
    expect(Object.keys(follow)).toEqual(
      expect.arrayContaining([
        'following',
        'follower',
        'id',
        'checked',
        'createdAt',
        'updatedAt',
      ]),
    );
  });

  it('자기 자신을 following하면 ApolloError.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    await expect(getFollowRepository().followingUser(aaa, aaa)).rejects.toThrow(
      ApolloError,
    );
  });

  it('없는 user를 following하면 ApolloError를 리턴한다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const noUser = getUserRepository().create({ email: 'ccc' });
    await expect(
      getFollowRepository().followingUser(aaa, noUser),
    ).rejects.toThrow(ApolloError);
  });

  it('aaa가 bbb를 following 한 후 다시 following 하면 ApolloError.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    const follow = (await getFollowRepository().followingUser(
      aaa,
      bbb,
    )) as Follow;
    expect(follow.follower.email).toEqual(aaa.email);
    expect(follow.following.email).toEqual(bbb.email);

    // 이미 following 한 유저를 following하면 ApolloError
    await expect(getFollowRepository().followingUser(aaa, bbb)).rejects.toThrow(
      ApolloError,
    );

    const followersOfbbb = await getFollowRepository().getFollowers(bbb);
    // console.log(followersOfbbb);
    expect(followersOfbbb).toHaveLength(1);
    expect(followersOfbbb.map((f) => f.follower.email)).toEqual([aaa.email]);
  });

  it('aaa, bbb가 ccc를 following 하면 ccc의 followers는 User[2]를 리턴한다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    const ccc = await getUserRepository().saveUserInfo(cccUserInfo);
    await getFollowRepository().followingUser(aaa, ccc);
    await getFollowRepository().followingUser(bbb, ccc);
    const followersOfccc = await getFollowRepository().getFollowers(ccc);
    // console.log(followersOfccc);
    expect(followersOfccc).toHaveLength(2);
    expect(followersOfccc.map((f) => f.follower.email).sort()).toEqual(
      [aaa.email, bbb.email].sort(),
    );
  });

  it('aaa가 bbb, ccc를 following 하면 aaa의 following는 User[2]를 리턴한다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    const ccc = await getUserRepository().saveUserInfo(cccUserInfo);
    await getFollowRepository().followingUser(aaa, bbb);
    await getFollowRepository().followingUser(aaa, ccc);
    const followingOfAaa = await getFollowRepository().getFollowing(aaa);
    // console.log(followingOfAaa);
    expect(followingOfAaa).toHaveLength(2);
    expect(followingOfAaa.map((f) => f.following.email).sort()).toEqual(
      [bbb.email, ccc.email].sort(),
    );
  });

  it('aaa의 following, followers를 모두 조회한다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    const ccc = await getUserRepository().saveUserInfo(cccUserInfo);
    const ddd = await getUserRepository().saveUserInfo(dddUserInfo);
    await getFollowRepository().followingUser(aaa, bbb);
    await getFollowRepository().followingUser(aaa, ccc);
    await getFollowRepository().followingUser(ddd, aaa);
    const allFollowOfAaa = await getFollowRepository().getAllFollow(aaa);
    // console.log(allFollowOfAaa);
    expect(allFollowOfAaa).toHaveLength(3);
  });

  it('follower를 following 할 수 없다. follow는 친구 추가만 가능하다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    await getFollowRepository().followingUser(aaa, bbb);
    await expect(getFollowRepository().followingUser(bbb, aaa)).rejects.toThrow(
      ApolloError,
    );
  });
});

describe('follow/following 삭제', () => {
  it('follower를 삭제 할 수 있다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    const ccc = await getUserRepository().saveUserInfo(cccUserInfo);
    await getFollowRepository().followingUser(aaa, ccc);
    await getFollowRepository().followingUser(bbb, ccc);
    const followOfCcc = (await getFollowRepository().deleteFollower(
      ccc,
      aaa,
    )) as Follow[];
    // console.log(followOfCcc);
    expect(followOfCcc).toHaveLength(1);
    expect(followOfCcc[0].follower.email).toEqual(bbbUserInfo.email);
  });

  it('following을 삭제 할 수 있다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    const ccc = await getUserRepository().saveUserInfo(cccUserInfo);
    await getFollowRepository().followingUser(aaa, bbb);
    await getFollowRepository().followingUser(aaa, ccc);

    await getFollowRepository().deleteFollowing(aaa, bbb);

    const followOfBbb = await getFollowRepository().getFollowers(bbb);
    const followOfCcc = await getFollowRepository().getFollowers(ccc);
    // console.log(followOfAaa);
    expect(followOfBbb).toEqual([]);
    expect(followOfCcc).toHaveLength(1);
    expect(followOfCcc[0].follower.email).toEqual(aaaUserInfo.email);
  });

  it('following을 모두 삭제하면 빈 배열을 리턴한다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    await getFollowRepository().followingUser(aaa, bbb);
    const followOfAaa = (await getFollowRepository().deleteFollowing(
      aaa,
      bbb,
    )) as Follow[];
    // console.log(followOfAaa);
    expect(followOfAaa).toEqual([]);
  });
});

describe('client에서의 follower 확인', () => {
  it('follower의 일부만 확인(check: false -> true)할 수 있다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    const ccc = await getUserRepository().saveUserInfo(cccUserInfo);
    const ddd = await getUserRepository().saveUserInfo(dddUserInfo);
    await getFollowRepository().followingUser(aaa, ddd);
    await getFollowRepository().followingUser(bbb, ddd);
    await getFollowRepository().followingUser(ccc, ddd);
    const followOfDdd = await getFollowRepository().checkFollowers(ddd, [
      bbb,
      ccc,
    ]);
    // console.log(followOfDdd);
    expect(followOfDdd).toHaveLength(3);
    const followOfAaa = followOfDdd.find(
      (f: Follow) => f.follower.email === aaaUserInfo.email,
    ) as Follow;
    const followOfBbb = followOfDdd.find(
      (f: Follow) => f.follower.email === bbbUserInfo.email,
    ) as Follow;
    const followOfCcc = followOfDdd.find(
      (f: Follow) => f.follower.email === cccUserInfo.email,
    ) as Follow;
    expect(followOfAaa.checked).toEqual(false);
    expect(followOfBbb.checked).toEqual(true);
    expect(followOfCcc.checked).toEqual(true);
  });
});
