import { Connection } from 'typeorm';
import { Motivation } from '../../entity/Motivations';
import connectDB, {
  getUserRepository,
  getMotivationRepository,
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

describe('Motivations 저장', () => {
  it('aaa가 Motivation을 저장할 수 있다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const motivations = [Motivation.FIND_FRIEND, Motivation.LONELINESS];

    await getMotivationRepository().saveByUser(aaa, motivations);

    const result = await getMotivationRepository().find();
    // console.log(result);
    expect(result).toHaveLength(2);
    expect(result.map((d) => d.motivation).sort()).toEqual(
      motivations.sort(),
    );
  });

  it('aaa가 motivation을 선택하여 저장 후 다시 저장하면 이전 데이터는 삭제된다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const before = [Motivation.FIND_FRIEND, Motivation.LONELINESS];
    const after = [Motivation.WEIGHT_INCREASE, Motivation.WEIGHT_LOSS];

    await getMotivationRepository().saveByUser(aaa, before);
    await getMotivationRepository().saveByUser(aaa, after);

    const result = await getMotivationRepository().find();
    // console.log(result);
    expect(result).toHaveLength(2);
    expect(result.map((d) => d.motivation).sort()).toEqual(
      after.sort(),
    );
  });
});
