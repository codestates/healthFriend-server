import {
  Gender,
  Provider,
  OpenImageChoice,
  LevelOf3Dae,
  Role,
} from '../../database/entity/User';

const admin = [
  {
    role: Role.ADMIN,
    email: 'admin@hf.club',
    nickname: 'admin',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: 'abc123',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L1,
  },
];

export default admin;
