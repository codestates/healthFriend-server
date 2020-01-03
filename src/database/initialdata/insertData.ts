import connectDB, {
  getDistrictRepository,
  getUserRepository,
  getMotivationRepository,
  getExerciseAbleDaysRepository,
  getAbleDistrictsRepository,
} from '..';

import gangnamgu from './districtGangnamgu';
import yongsangu from './districtYongsangu';
import songpagu from './districtSongpagu';
import users from './usersInfo';
import { User } from '../entity/User';

const districtInitialData = async () => {
  await getDistrictRepository().saveDongInfos(gangnamgu);
  await getDistrictRepository().saveDongInfos(yongsangu);
  await getDistrictRepository().saveDongInfos(songpagu);
};

const userInitialData = async () => {
  await getUserRepository().saveUsersInfo(users);
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
    const dongIds: Array<string> = [];
    m.districts.forEach(async (d) => {
      const result = await getDistrictRepository().findOne({
        where: { nameOfDong: d.nameOfDong, idOfGu: d.idOfGu },
      });
      if (result && result.idOfDong) {
        dongIds.push(result?.idOfDong);
      }
    });
    await getAbleDistrictsRepository().saveByDongId(user.id, dongIds);
  });
};

const run = async () => {
  await connectDB();
  await districtInitialData();
  await userInitialData();
  await motivationInitialData();
  await exerciseAbleDaysInitialData();
  await ableDistrictsInitialData();
};

run();
