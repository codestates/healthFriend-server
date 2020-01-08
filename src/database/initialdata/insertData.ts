import connectDB, {
  getDistrictRepository,
  getUserRepository,
  getMotivationRepository,
  getExerciseAbleDaysRepository,
  getAbleDistrictsRepository,
  getFriendsRepository,
} from '..';

import gangnamgu from './districtGangnamgu';
import yongsangu from './districtYongsangu';
import songpagu from './districtSongpagu';
import users from './usersInfo';
import { User } from '../entity/User';
import { Districts } from '../entity/Districts';

const districtInitialData = async () => {
  await getDistrictRepository().saveDongInfos(gangnamgu);
  await getDistrictRepository().saveDongInfos(yongsangu);
  await getDistrictRepository().saveDongInfos(songpagu);
};

const userInitialData = async () => {
  await getUserRepository().saveUsersInfo(users);
};

const updateUserInfo = async () => {
  users.forEach(async (m) => {
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

const motivationInitialData = async () => {
  users.forEach(async (m) => {
    const user = (await getUserRepository().findOne({
      where: { email: m.email },
    })) as User;
    await getMotivationRepository().saveByUserId(user.id, m.motivations);
  });
};

const exerciseAbleDaysInitialData = async () => {
  users.forEach(async (m) => {
    const user = (await getUserRepository().findOne({
      where: { email: m.email },
    })) as User;
    await getExerciseAbleDaysRepository().saveByUserId(user.id, m.ableDays);
  });
};

const ableDistrictsInitialData = async () => {
  users.forEach(async (m) => {
    const user = (await getUserRepository().findOne({
      where: { email: m.email },
    })) as User;

    const dongIds = await Promise.all(
      m.districts.map(async (d) => {
        const result: Districts = (await getDistrictRepository().findOne({
          where: { nameOfDong: d.nameOfDong, idOfGu: d.idOfGu },
        })) as Districts;
        return result.idOfDong;
      }),
    );

    await getAbleDistrictsRepository().saveByDongId(user.id, dongIds);
  });
};

const addFollowingRandomly = async () => {
  const savedUsers = await getUserRepository().find();
  savedUsers.forEach((u) => {
    const followingNumbers = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * savedUsers.length));
    followingNumbers.forEach(async (n) => {
      await getUserRepository().followingUser(u.id, savedUsers[n].id);
    });
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
  friends.forEach(async (f) =>
    getFriendsRepository().testAddFriend(me.id, f.id));
};

const run = async () => {
  await connectDB();
  await districtInitialData();
  await userInitialData();
  await updateUserInfo();
  await motivationInitialData();
  await exerciseAbleDaysInitialData();
  await ableDistrictsInitialData();
  await addFollowingRandomly();
  await addfriendToYgKwon();
};

run();
