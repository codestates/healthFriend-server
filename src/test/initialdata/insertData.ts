import connectDB, {
  getDistrictRepository,
  getUserRepository,
  getMotivationRepository,
  getAbleDistrictsRepository,
  getExerciseAbleDaysRepository,
  getFollowRepository,
  getFriendsRepository,
  getImageRepo,
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
  messageToFriend: string;
  levelOf3Dae: LevelOf3Dae;
  motivations: string[];
  ableDays: string[];
  districts: DistrictInput[];
  profileImage: string;
}

const MOTIVATIONS = [
  'WEIGHT_INCREASE',
  'WEIGHT_LOSS',
  'FIND_FRIEND',
  'LONELINESS',
];

const WEEKDAY = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
];

const districtInitialData = async () => {
  await getDistrictRepository().saveDongInfos(districtData);
};

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

  const profileImage = getImageRepo().create({
    user,
    filename: args.profileImage,
  });
  await getImageRepo().save(profileImage);
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
  if (specialUser) {
    const allUser = await getUserRepository().find();
    await Promise.all(
      allUser.map(async (u, index) => {
        if (!(index % 3) && u.id !== specialUser.id) {
          await getFollowRepository().followingUser(u, specialUser);
        }
      }),
    );
  }
};

const makeRandomArray = (data: string[]) => {
  const randomLength = Math.ceil(Math.random() * data.length);
  const arrayOfRandomNumber: number[] = [];

  while (arrayOfRandomNumber.length < randomLength) {
    const randomNumber = Math.floor(Math.random() * data.length);
    if (!arrayOfRandomNumber.includes(randomNumber)) {
      arrayOfRandomNumber.push(randomNumber);
    }
  }
  return arrayOfRandomNumber.map((n) => data[n]);
};

const makeDistrict = () => {
  let randomNumber = Math.floor(Math.random() * (districtData.length - 1));
  if (randomNumber > districtData.length - 4) {
    randomNumber = districtData.length - 4;
  }
  return [
    districtData[randomNumber],
    districtData[randomNumber + 1],
    districtData[randomNumber + 2],
  ];
};

const setOpenImageChoice = (openImageChoice: string) => {
  switch (openImageChoice) {
    case 'CLOSE':
      return OpenImageChoice.CLOSE;
    case 'OPEN':
      return OpenImageChoice.OPEN;
    case 'FRIEND':
      return OpenImageChoice.FRIEND;
    default:
      return OpenImageChoice.CLOSE;
  }
};

const setLevelOf3Dae = (levelOf3Dae: string) => {
  switch (levelOf3Dae) {
    case 'L1':
      return LevelOf3Dae.L1;
    case 'L2':
      return LevelOf3Dae.L2;
    case 'L3':
      return LevelOf3Dae.L3;
    case 'L4':
      return LevelOf3Dae.L4;
    case 'L5':
      return LevelOf3Dae.L5;
    default:
      return LevelOf3Dae.L1;
  }
};

const makeProfileImage = (gender: string) => {
  const randomNumber = Math.floor(Math.random() * 100);
  let menOrWomen: string;
  if (gender === 'MALE') {
    menOrWomen = 'men';
  } else {
    menOrWomen = 'women';
  }
  // eslint-disable-next-line max-len
  return `https://randomuser.me/api/portraits/${menOrWomen}/${randomNumber}.jpg`;
};

export const makeUserData = (user: any): InputUserValue => {
  const newUser: InputUserValue = {
    role: user.role === 'USER' ? Role.USER : Role.ADMIN,
    email: user.email,
    nickname: user.nickname,
    gender: user.gender === 'MALE' ? Gender.MALE : Gender.FEMALE,
    provider: user.provider === 'GOOGLE' ? Provider.GOOGLE : Provider.FACEBOOK,
    snsId: user.snsId,
    openImageChoice: setOpenImageChoice(user.openImageChoice),
    levelOf3Dae: setLevelOf3Dae(user.levelOf3Dae),
    messageToFriend: user.messageToFriend,
    motivations: makeRandomArray(MOTIVATIONS),
    ableDays: makeRandomArray(WEEKDAY),
    districts: makeDistrict(),
    profileImage: makeProfileImage(user.gender),
  };
  return newUser;
};

export const run = async (users: any, admin: InputUserValue) => {
  await connectDB();
  await districtInitialData();
  await Promise.all(
    users.map(async (u: InputUserValue) => {
      await insertUser(makeUserData(u));
      // await insertUser(u);
    }),
  );
  await addSpecialUserTestData('bfsudong@gmail.com');
  await addFollowingRandomly();
  await insertUser(admin);
};

run(usersInfo, adminInfo);
// run(adminInfo);
