import { Connection } from 'typeorm';
import { Weekday } from '../../entity/ExerciseAbleDays';
import connectDB, {
  getUserRepository,
  getExerciseAbleDaysRepository,
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

describe('Exercise able days 저장', () => {
  it('aaa가 요일을 선택하여 저장할 수 있다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const exerciseAbleDays = [Weekday.MONDAY, Weekday.TUESDAY];

    await getExerciseAbleDaysRepository().saveByUser(aaa, exerciseAbleDays);

    const result = await getExerciseAbleDaysRepository().find();
    // console.log(result);
    expect(result).toHaveLength(2);
    expect(result.map((d) => d.weekday).sort()).toEqual(
      exerciseAbleDays.sort(),
    );
  });

  it('aaa가 요일을 선택하여 저장 후 다시 저장하면 이전 데이터는 삭제된다.', async () => {
    const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const before = [Weekday.MONDAY, Weekday.TUESDAY];
    const after = [Weekday.FRIDAY, Weekday.SATURDAY];

    await getExerciseAbleDaysRepository().saveByUser(aaa, before);
    await getExerciseAbleDaysRepository().saveByUser(aaa, after);

    const result = await getExerciseAbleDaysRepository().find();
    // console.log(result);
    expect(result).toHaveLength(2);
    expect(result.map((d) => d.weekday).sort()).toEqual(
      after.sort(),
    );
  });
});
