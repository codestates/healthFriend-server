import connectDB, { getDistrictRepository, getUserRepository } from '..';

import gangnamgu from './districtGangnamgu';
import yongsangu from './districtYongsangu';
import songpagu from './districtSongpagu';
import users from './usersInfo';

(async () => {
  await connectDB();
  await getDistrictRepository().saveDongInfos(gangnamgu);
  await getDistrictRepository().saveDongInfos(yongsangu);
  await getDistrictRepository().saveDongInfos(songpagu);
  await getUserRepository().saveUsersInfo(users);
})();
