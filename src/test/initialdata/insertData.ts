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
import adminInfo from './adminInfo';
import {
  Gender,
  OpenImageChoice,
  LevelOf3Dae,
  Role,
  Provider,
  User,
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
  // console.log(savedUser);

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
  try {
    await Promise.all(
      allUsers.map(async (u) => {
        const followingNumbers = Array.from({ length: 3 }, () =>
          Math.floor(Math.random() * allUsers.length));
        const following = followingNumbers.map((f) => allUsers[f]);
        await getFollowRepository().followingUser(u, following[0]);
        await getFollowRepository().followingUser(u, following[1]);
        await getFollowRepository().followingUser(u, following[2]);
        await getFriendsRepository().addFriend(following[0], u);
      }),
    );
  } catch (error) {
    console.log(error);
  }
};

const addSpecialUserTestData = async (email: string) => {
  const specialUser = (await getUserRepository().findOne({ email })) as User;
  const allUser = await getUserRepository().find();
  await Promise.all(allUser.map(async (u, index) => {
    if (!(index % 3) && (u.id !== specialUser.id)) {
      await getFollowRepository().followingUser(u, specialUser);
    }
  }));
};

export const run = async (users: InputUserValue[], admin: InputUserValue) => {
  await connectDB();
  await districtInitialData();
  await Promise.all(
    users.map(async (u: InputUserValue) => {
      await insertUser(u);
    }),
  );
  await addSpecialUserTestData('bfsudong@gmail.com');
  await addFollowingRandomly();
  await insertUser(admin);
};

run(usersInfo, adminInfo);
// run(adminInfo);
