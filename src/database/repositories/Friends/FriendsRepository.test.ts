import { Connection } from 'typeorm';
import { ApolloError } from 'apollo-server-express';
import connectDB, {
  getUserRepository,
  getFriendsRepository,
  getFollowRepository,
} from '../..';
import { Role, Provider, User } from '../../entity/User';
import { Friends } from '../../entity/Friends';

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

describe('친구 추가', () => {
  it('친구를 추가할 수 있다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    await getFollowRepository().followingUser(bbb, aaa);
    const friend = await getFriendsRepository().addFriend(aaa, bbb);
    // console.log(friend);
    expect(friend.me.id).toEqual(aaa.id);
    expect(friend.friend.id).toEqual(bbb.id);
  });

  it('친구 추가가 되면 양방향으로 친구가 등록된다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    await getFollowRepository().followingUser(bbb, aaa);

    const aaaFriend = await getFriendsRepository().addFriend(aaa, bbb);
    // console.log(friend);
    expect(aaaFriend.me.id).toEqual(aaa.id);
    expect(aaaFriend.friend.id).toEqual(bbb.id);

    const bbbFriends = await getFriendsRepository().getFriends(bbb);
    // console.log(bbbFriends);
    expect(bbbFriends).toHaveLength(1);
    expect(bbbFriends[0].me.id).toEqual(bbb.id);
    expect(bbbFriends[0].friend.id).toEqual(aaa.id);
  });

  it('me, friend 둘 중에 하나라도 없는 계정이면 ApolloError 리턴', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    const noUser = getUserRepository().create({ id: 'noUser' });
    await expect(getFriendsRepository().addFriend(aaa, noUser)).rejects.toThrow(
      ApolloError,
    );
    await expect(getFriendsRepository().addFriend(noUser, bbb)).rejects.toThrow(
      ApolloError,
    );
  });

  it('이미 친구이면 ApolloError 리턴', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    const ccc = await getUserRepository().saveUserInfo(cccUserInfo);

    await getFollowRepository().followingUser(bbb, aaa);
    await getFriendsRepository().addFriend(aaa, bbb);
    await getFollowRepository().followingUser(aaa, ccc);
    await getFriendsRepository().addFriend(ccc, aaa);

    await expect(getFriendsRepository().addFriend(aaa, bbb)).rejects.toThrow(
      ApolloError,
    );
    await expect(getFriendsRepository().addFriend(aaa, ccc)).rejects.toThrow(
      ApolloError,
    );
  });

  it('me의 following에 friend가 없으면 ApolloError 리턴', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);

    await expect(getFriendsRepository().addFriend(aaa, bbb)).rejects.toThrow(
      ApolloError,
    );
    await expect(getFriendsRepository().addFriend(bbb, aaa)).rejects.toThrow(
      ApolloError,
    );
  });

  it('친구로 추가되면 me의 follower(me)를 삭제한다.', async () => {
    // 친구로 추가되면 friend의 following(friend)을 삭제한다.
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    await getFollowRepository().followingUser(bbb, aaa);
    await getFriendsRepository().addFriend(aaa, bbb);
    expect(await getFollowRepository().isFollower(aaa, bbb)).toBeFalsy();
    expect(await getFollowRepository().isFollowing(bbb, aaa)).toBeFalsy();
  });
});

describe('friend 조회', () => {
  it('user로 친구 목록(User[])을 조회할 수 있다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    const ccc = await getUserRepository().saveUserInfo(cccUserInfo);
    const ddd = await getUserRepository().saveUserInfo(dddUserInfo);

    await getFollowRepository().followingUser(bbb, aaa);
    await getFriendsRepository().addFriend(aaa, bbb);
    await getFollowRepository().followingUser(ccc, aaa);
    await getFriendsRepository().addFriend(aaa, ccc);
    await getFollowRepository().followingUser(aaa, ddd);
    await getFriendsRepository().addFriend(ddd, aaa);
    const aaaFriends: User[] = await getFriendsRepository().getFriendUserList(
      aaa,
    );
    // console.log(aaaFriends);
    expect(aaaFriends).toHaveLength(3);
    expect(aaaFriends.map((f) => f.email).sort()).toEqual([
      bbb.email,
      ccc.email,
      ddd.email,
    ]);
  });

  it('user로 친구 목록(Friends[])을 조회할 수 있다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    const ccc = await getUserRepository().saveUserInfo(cccUserInfo);
    const ddd = await getUserRepository().saveUserInfo(dddUserInfo);

    await getFollowRepository().followingUser(bbb, aaa);
    await getFriendsRepository().addFriend(aaa, bbb);
    await getFollowRepository().followingUser(ccc, aaa);
    await getFriendsRepository().addFriend(aaa, ccc);
    await getFollowRepository().followingUser(aaa, ddd);
    await getFriendsRepository().addFriend(ddd, aaa);
    const aaaFriends: Friends[] = await getFriendsRepository().getFriends(aaa);
    // console.log(aaaFriends);
    expect(aaaFriends).toHaveLength(3);
    expect(aaaFriends.every((f) => f.me.id === aaa.id)).toBeTruthy();
    expect(aaaFriends.map((f) => f.friend.email).sort()).toEqual([
      bbb.email,
      ccc.email,
      ddd.email,
    ]);
  });

  it('존재하지 않는 id로 친구를 검색하면 ApolloError 예외가 발생한다.', async () => {
    const noUser = getUserRepository().create({ id: 'noUser' });
    await expect(
      getFriendsRepository().getFriendUserList(noUser),
    ).rejects.toThrow(ApolloError);
  });
});

describe('친구 삭제', () => {
  // 존재하면 그냥 삭제
  it('친구를 삭제하면 me = user, friend = user 두 데이터가 모두 삭제된다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);

    await getFollowRepository().followingUser(bbb, aaa);
    await getFriendsRepository().addFriend(aaa, bbb);

    await getFriendsRepository().deleteFriend(aaa, bbb);
    const aaaFriendUserList = await getFriendsRepository().getFriendUserList(
      aaa,
    );
    const bbbFriendUserList = await getFriendsRepository().getFriendUserList(
      bbb,
    );
    expect(aaaFriendUserList.some((f) => f.id === bbb.id)).toBeFalsy();
    expect(bbbFriendUserList.every((f) => f.id !== bbb.id)).toBeTruthy();
  });
});

// 친구를 신청을 수락한 사람 즉 following user는 친구 신청을 수락하자 마자 checked: true
// follower는 checked: false
describe('친구 확인', () => {
  it('친구 요청을 수락한 유저는 checked 항목이 true가 된다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);

    await getFollowRepository().followingUser(bbb, aaa);
    const aaaFriend = await getFriendsRepository().addFriend(aaa, bbb);
    expect(aaaFriend.checked).toEqual(true);
  });

  it('친구 요청을 한 유저는 수락이 되면 checked 항목이 false가 된다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);

    await getFollowRepository().followingUser(bbb, aaa);
    await getFriendsRepository().addFriend(aaa, bbb);
    const bbbFriends = await getFriendsRepository().getFriends(bbb);
    expect(bbbFriends[0].checked).toEqual(false);
  });

  it('친구 요청을 한 유저가 친구신청을 확인하면 checked 항목이 true가 된다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const bbb = await getUserRepository().saveUserInfo(bbbUserInfo);
    const ccc = await getUserRepository().saveUserInfo(cccUserInfo);
    const ddd = await getUserRepository().saveUserInfo(dddUserInfo);

    await getFollowRepository().followingUser(aaa, bbb);
    await getFriendsRepository().addFriend(bbb, aaa);
    await getFollowRepository().followingUser(aaa, ccc);
    await getFriendsRepository().addFriend(ccc, aaa);
    await getFollowRepository().followingUser(aaa, ddd);
    await getFriendsRepository().addFriend(ddd, aaa);

    const aaaFriends = await getFriendsRepository().checkFriends(aaa, [
      bbb,
      ccc,
    ]);
    expect(aaaFriends.filter((f) => f.friend.id === bbb.id)[0].checked).toEqual(
      true,
    );
    expect(aaaFriends.filter((f) => f.friend.id === ccc.id)[0].checked).toEqual(
      true,
    );
    expect(aaaFriends.filter((f) => f.friend.id === ddd.id)[0].checked).toEqual(
      false,
    );
  });
});
