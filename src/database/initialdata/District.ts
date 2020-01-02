import connectDB, { getDistrictRepository } from '..';

import gangnamgu from './gangnamgu';

(async () => {
  await connectDB();
  await getDistrictRepository().saveDongInfos(gangnamgu);
})();
