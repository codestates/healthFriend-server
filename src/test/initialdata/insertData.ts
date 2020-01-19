import connectDB, {
  getDistrictRepository,
  getUserRepository,
  getMotivationRepository,
  // getExerciseAbleDaysRepository,
  getAbleDistrictsRepository,
  getExerciseAbleDaysRepository,
  getFollowRepository,
  getFriendsRepository,
  // getFriendsRepository,
} from '../../database';

import gangnamgu from './districtGangnamgu';
import yongsangu from './districtYongsangu';
import songpagu from './districtSongpagu';
import usersInfo from './usersInfo';
import admin from './adminInfo';
import {
  // User,
  Gender,
  OpenImageChoice,
  LevelOf3Dae,
  Role,
  Provider,
} from '../../database/entity/User';
import { Districts } from '../../database/entity/Districts';
// import { RegisterUserInfo } from '../../types/types';

const districtInitialData = async () => {
  await getDistrictRepository().saveDongInfos(gangnamgu);
  await getDistrictRepository().saveDongInfos(yongsangu);
  await getDistrictRepository().saveDongInfos(songpagu);
};

interface DistrictInput {
  nameOfDong: string;
  idOfGu: number;
  nameOfGu: string;
}

interface InputUserValue {
  role: Role;
  email: string;
  nickname: string;
  gender: Gender;
  provider: Provider;
  snsId: string;
  openImageChoice: OpenImageChoice;
  levelOf3Dae: LevelOf3Dae;
  motivations: string[];
  ableDays: string[];
  districts: DistrictInput[];
}

const insertUser = async (args: InputUserValue) => {
  const user = getUserRepository().create({
    role: args.role,
    email: args.email,
    nickname: args.nickname,
    gender: args.gender,
    provider: args.provider,
    snsId: args.snsId,
    openImageChoice: args.openImageChoice,
    levelOf3Dae: args.levelOf3Dae,
    messageToFriend: 'hello',
  });
  const savedUser = await getUserRepository().save(user);

  const motivationInstance = args.motivations.map((m) => ({
    owner: savedUser,
    motivation: m,
  }));
  await getMotivationRepository().save(motivationInstance);

  const ableDaysInstance = args.ableDays.map((d) => ({
    user: savedUser,
    weekday: d,
  }));
  await getExerciseAbleDaysRepository().save(ableDaysInstance);

  args.districts.forEach(async (d) => {
    const district = (await getDistrictRepository().findOne(d)) as Districts;
    const instance = {
      user,
      district,
    };
    await getAbleDistrictsRepository().save(instance);
  });
};

const addFollowingRandomly = async () => {
  const allUsers = await getUserRepository().find();
  await Promise.all(allUsers.map(async (u) => {
    const followingNumbers = Array.from({ length: 3 }, () =>
      Math.floor(Math.random() * allUsers.length));
    const following = followingNumbers.map((f) => allUsers[f]);
    await getFollowRepository().followingUser(u, following[0]);
    await getFollowRepository().followingUser(u, following[1]);
    await getFollowRepository().followingUser(u, following[2]);
    await getFriendsRepository().addFriend(following[0], u);
  }));
};

const adminInitialData = async () => {
  await getUserRepository().saveUsersInfo(admin);
};

export const run = async (users: InputUserValue[]) => {
  await connectDB();
  await districtInitialData();
  await Promise.all(users.map(async (u: InputUserValue) => {
    await insertUser(u);
  }));
  await addFollowingRandomly();
  await adminInitialData();
};

run(usersInfo);

// const userInitialData = async (users: Array<RegisterUserInfo>) => {
//   await getUserRepository().saveUsersInfo(users);
// };

// const updateUserInfo = async (users: any) => {
//   users.forEach(async (m: any) => {
//     const user = (await getUserRepository().findOne({
//       where: { email: m.email },
//     })) as User;
//     const expectUserData = getUserRepository().create({
//       id: aaa.id,
//       nickname: 'abc',
//       gender: Gender.FEMALE,
//       openImageChoice: OpenImageChoice.CLOSE,
//       levelOf3Dae: LevelOf3Dae.L2,
//       messageToFriend: 'hello',
//     });
//     const detailedUserInfo = {
//       nickname: m.nickname,
//       gender: m.gender,
//       openImageChoice: m.openImageChoice,
//       levelOf3Dae: m.levelOf3Dae,
//       messageToFriend: '',
//     };
//     await getUserRepository().updateUserInfo(user.id, detailedUserInfo);
//   });
// };

// const motivationInitialData = async (users: any) => {
//   users.forEach(async (m: any) => {
//     const user = (await getUserRepository().findOne({
//       where: { email: m.email },
//     })) as User;
//     await getMotivationRepository().saveByUserId(user.id, m.motivations);
//   });
// };

// const exerciseAbleDaysInitialData = async (users: any) => {
//   users.forEach(async (m: any) => {
//     const user = (await getUserRepository().findOne({
//       where: { email: m.email },
//     })) as User;
//     await getExerciseAbleDaysRepository().saveByUserId(user.id, m.ableDays);
//   });
// };

// const ableDistrictsInitialData = async (users: any) => {
//   users.forEach(async (m: any) => {
//     const user = (await getUserRepository().findOne({
//       where: { email: m.email },
//     })) as User;

//     const dongIds: Array<string> = await Promise.all(
//       m.districts.map(async (d: any) => {
//         const result = (await getDistrictRepository().findOne({
//           where: { nameOfDong: d.nameOfDong, idOfGu: d.idOfGu },
//         })) as Districts;
//         return result.idOfDong;
//       }),
//     );

//     await getAbleDistrictsRepository().saveByDongId(user.id, dongIds);
//   });
// };

// const addfriendToYgKwon = async () => {
//   const me = await getUserRepository().findOne({
//     where: {
//       email: 'bfsudong@gmail.com',
//     },
//   });

//   if (!me) return;

//   const friends = await getUserRepository().find({
//     where: [
//       { email: 'aaa@gmail.com' },
//       { email: 'bbb@gmail.com' },
//       { email: 'ccc@gmail.com' },
//     ],
//   });
//   console.log(friends);
//   // friends.forEach(async (f) =>
//   //   getFriendsRepository().addFriend(me.id, f.id));
//   await getUserRepository().followingUser(friends[0].id, me.id);
//   await getUserRepository().followingUser(friends[1].id, me.id);
//   await getUserRepository().followingUser(friends[2].id, me.id);
//   await getFriendsRepository().addFriend(me.id, friends[0].id);
//   await getFriendsRepository().addFriend(me.id, friends[1].id);
//   await getFriendsRepository().addFriend(me.id, friends[2].id);
// };


// export const run = async (users: any) => {
//   await connectDB();
//   await districtInitialData();
//   await userInitialData(users);
//   await updateUserInfo(users);
//   await motivationInitialData(users);
//   await exerciseAbleDaysInitialData(users);
//   await ableDistrictsInitialData(users);
//   await addFollowingRandomly();
//   await addfriendToYgKwon();
//   await adminInitialData();
// };

// run(usersInfo);
