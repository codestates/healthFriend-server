import { Connection } from 'typeorm';
import connectDB, {
  getUserRepository,
  getDistrictRepository,
  getAbleDistrictsRepository,
} from '../..';
import { Role, Provider } from '../../entity/User';

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

const districtData1 = [
  { idOfGu: 1, nameOfGu: '강남구', nameOfDong: '개포1동' },
  { idOfGu: 1, nameOfGu: '강남구', nameOfDong: '개포2동' },
];

const districtData2 = [
  { idOfGu: 1, nameOfGu: '강남구', nameOfDong: '개포4동' },
];

describe('able district 저장', () => {
  it('aaa가 x, y 지역을 선택하여 저장할 수 있다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const dist1 = await getDistrictRepository().save(districtData1[0]);
    const dist2 = await getDistrictRepository().save(districtData1[1]);

    await getAbleDistrictsRepository().saveByDongId(aaa.id, [
      dist1.idOfDong,
      dist2.idOfDong,
    ]);

    const result = await getAbleDistrictsRepository().findByUser(aaa);
    // console.log(result);
    expect(result).toHaveLength(2);
    expect(result.map((d) => d.user.email)).toEqual([aaa.email, aaa.email]);
    expect(result.map((d) => d.district.nameOfDong).sort()).toEqual(
      districtData1.map((d) => d.nameOfDong).sort(),
    );
  });

  it('aaa가 지역을 다시 저장하면 기존 정보는 삭제 된다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const dist1 = await getDistrictRepository().save(districtData1[0]);
    const dist2 = await getDistrictRepository().save(districtData1[1]);

    await getAbleDistrictsRepository().saveByDongId(aaa.id, [
      dist1.idOfDong,
      dist2.idOfDong,
    ]);

    const dist3 = await getDistrictRepository().save(districtData2[0]);

    await getAbleDistrictsRepository().saveByDongId(aaa.id, [dist3.idOfDong]);

    const result = await getAbleDistrictsRepository().findByUser(aaa);
    // console.log(result);
    expect(result).toHaveLength(1);
    expect(result.map((d) => d.user.email)).toEqual([aaa.email]);
    expect(result.map((d) => d.district.nameOfDong)).toEqual(
      districtData2.map((d) => d.nameOfDong),
    );
  });
});
