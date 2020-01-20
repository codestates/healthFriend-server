import {
  Gender,
  Provider,
  OpenImageChoice,
  LevelOf3Dae,
  Role,
} from '../../database/entity/User';

const adminInfo = {
  role: Role.ADMIN,
  email: 'admin@hf.club',
  nickname: 'admin',
  gender: Gender.MALE,
  provider: Provider.GOOGLE,
  snsId: 'abc123',
  openImageChoice: OpenImageChoice.OPEN,
  levelOf3Dae: LevelOf3Dae.L1,
  motivations: ['WEIGHT_INCREASE'],
  ableDays: ['MONDAY'],
  districts: [
    { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
  ],
};

export default adminInfo;
