import connectDB, {
  getDistrictRepository,
  getUserRepository,
  getMotivationRepository,
  getExerciseAbleDaysRepository,
  getAbleDistrictsRepository,
  getFriendsRepository,
} from '../../database';

import gangnamgu from './districtGangnamgu';
import yongsangu from './districtYongsangu';
import songpagu from './districtSongpagu';
import usersInfo from './usersInfo';
import admin from './adminInfo';
import { User } from '../../database/entity/User';
import { Districts } from '../../database/entity/Districts';
import { RegisterUserInfo } from '../../types/User.types';

const districtInitialData = async () => {
  await getDistrictRepository().saveDongInfos(gangnamgu);
  await getDistrictRepository().saveDongInfos(yongsangu);
  await getDistrictRepository().saveDongInfos(songpagu);
};

const userInitialData = async (users: Array<RegisterUserInfo>) => {
  await getUserRepository().saveUsersInfo(users);
};

const updateUserInfo = async (users: any) => {
  users.forEach(async (m: any) => {
    const user = (await getUserRepository().findOne({
      where: { email: m.email },
    })) as User;
    const detailedUserInfo = {
      nickname: m.nickname,
      gender: m.gender,
      openImageChoice: m.openImageChoice,
      levelOf3Dae: m.levelOf3Dae,
      messageToFriend: '',
    };
    await getUserRepository().updateUserInfo(user.id, detailedUserInfo);
  });
};

const motivationInitialData = async (users: any) => {
  users.forEach(async (m: any) => {
    const user = (await getUserRepository().findOne({
      where: { email: m.email },
    })) as User;
    await getMotivationRepository().saveByUserId(user.id, m.motivations);
  });
};

const exerciseAbleDaysInitialData = async (users: any) => {
  users.forEach(async (m: any) => {
    const user = (await getUserRepository().findOne({
      where: { email: m.email },
    })) as User;
    await getExerciseAbleDaysRepository().saveByUserId(user.id, m.ableDays);
  });
};

const ableDistrictsInitialData = async (users: any) => {
  users.forEach(async (m: any) => {
    const user = (await getUserRepository().findOne({
      where: { email: m.email },
    })) as User;

    const dongIds: Array<string> = await Promise.all(
      m.districts.map(async (d: any) => {
        const result = (await getDistrictRepository().findOne({
          where: { nameOfDong: d.nameOfDong, idOfGu: d.idOfGu },
        })) as Districts;
        return result.idOfDong;
      }),
    );

    await getAbleDistrictsRepository().saveByDongId(user.id, dongIds);
  });
};

const addFollowingRandomly = async () => {
  const savedUsers = await getUserRepository().find(
    { relations: ['following', 'followers'] },
  );
  savedUsers.forEach(async (u) => {
    const followingNumbers = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * savedUsers.length));
    const following = followingNumbers.map((f) => savedUsers[f]);
    const filtered = following.filter((f) => u.id !== f.id);
    // eslint-disable-next-line no-param-reassign
    u.following = filtered;
    await getUserRepository().save(u);
  });
};

const addfriendToYgKwon = async () => {
  const me = await getUserRepository().findOne({
    where: {
      email: 'bfsudong@gmail.com',
    },
  });

  if (!me) return;

  const friends = await getUserRepository().find({
    where: [
      { email: 'aaa@gmail.com' },
      { email: 'bbb@gmail.com' },
      { email: 'ccc@gmail.com' },
    ],
  });
  console.log(friends);
  // friends.forEach(async (f) =>
  //   getFriendsRepository().addFriend(me.id, f.id));
  await getUserRepository().followingUser(friends[0].id, me.id);
  await getUserRepository().followingUser(friends[1].id, me.id);
  await getUserRepository().followingUser(friends[2].id, me.id);
  await getFriendsRepository().addFriend(me.id, friends[0].id);
  await getFriendsRepository().addFriend(me.id, friends[1].id);
  await getFriendsRepository().addFriend(me.id, friends[2].id);
};

const adminInitialData = async () => {
  await getUserRepository().saveUsersInfo(admin);
};

export const run = async (users: any) => {
  await connectDB();
  await districtInitialData();
  await userInitialData(users);
  await updateUserInfo(users);
  await motivationInitialData(users);
  await exerciseAbleDaysInitialData(users);
  await ableDistrictsInitialData(users);
  await addFollowingRandomly();
  await addfriendToYgKwon();
  await adminInitialData();
};

run(usersInfo);
