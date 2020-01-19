import connectDB, {
  getDistrictRepository,
  getUserRepository,
  getMotivationRepository,
  getAbleDistrictsRepository,
  getExerciseAbleDaysRepository,
  getFollowRepository,
  getFriendsRepository,
} from '../../database';

import districtData from './districtData';
import usersInfo from './usersInfo';
import admin from './adminInfo';
import {
  Gender,
  OpenImageChoice,
  LevelOf3Dae,
  Role,
  Provider,
} from '../../database/entity/User';
import { Districts } from '../../database/entity/Districts';

const districtInitialData = async () => {
  await getDistrictRepository().saveDongInfos(districtData);
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
