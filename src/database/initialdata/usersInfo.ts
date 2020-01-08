import {
  Provider, OpenImageChoice, LevelOf3Dae, Gender, Role,
} from '../entity/User';

const users = [
  {
    role: Role.USER,
    email: 'aaa@gmail.com',
    nickname: 'aaa',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '1',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L1,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
      'FIND_FRIEND',
      'LONELINESS',
    ],
    ableDays: [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ],
    districts: [
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'bbb@gmail.com',
    nickname: 'bbb',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '2',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L1,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
      'FIND_FRIEND',
      'LONELINESS',
    ],
    ableDays: ['MONDAY', 'WEDNESDAY', 'THURSDAY', 'SATURDAY', 'SUNDAY'],
    districts: [
      { nameOfDong: '거여1동', idOfGu: 3, nameOfGu: '송파구' },
      { nameOfDong: '거여2동', idOfGu: 3, nameOfGu: '송파구' },
      { nameOfDong: '마천1동', idOfGu: 3, nameOfGu: '송파구' },
      { nameOfDong: '마천2동', idOfGu: 3, nameOfGu: '송파구' },
    ],
  },
  {
    role: Role.USER,
    email: 'ccc@gmail.com',
    nickname: 'ccc',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '3',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L1,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
      'FIND_FRIEND',
      'LONELINESS',
    ],
    ableDays: [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ],
    districts: [
      { nameOfDong: '거여1동', idOfGu: 3, nameOfGu: '송파구' },
      { nameOfDong: '거여2동', idOfGu: 3, nameOfGu: '송파구' },
      { nameOfDong: '마천1동', idOfGu: 3, nameOfGu: '송파구' },
      { nameOfDong: '마천2동', idOfGu: 3, nameOfGu: '송파구' },
    ],
  },
  {
    role: Role.USER,
    email: 'ddd@gmail.com',
    nickname: 'ddd',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '4',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L2,
    motivations: ['WEIGHT_LOSS', 'FIND_FRIEND', 'LONELINESS'],
    ableDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
    districts: [
      { nameOfDong: '거여1동', idOfGu: 3, nameOfGu: '송파구' },
      { nameOfDong: '거여2동', idOfGu: 3, nameOfGu: '송파구' },
      { nameOfDong: '마천1동', idOfGu: 3, nameOfGu: '송파구' },
      { nameOfDong: '마천2동', idOfGu: 3, nameOfGu: '송파구' },
    ],
  },
  {
    role: Role.USER,
    email: 'eee@gmail.com',
    nickname: 'eee',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '5',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L2,
    motivations: ['WEIGHT_INCREASE', 'FIND_FRIEND', 'LONELINESS'],
    ableDays: ['MONDAY', 'WEDNESDAY', 'FRIDAY'],
    districts: [
      { nameOfDong: '이태원1동', idOfGu: 2, nameOfGu: '용산구' },
      { nameOfDong: '이태원2동', idOfGu: 2, nameOfGu: '용산구' },
    ],
  },
  {
    role: Role.USER,
    email: 'fff@gmail.com',
    nickname: 'fff',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '6',
    openImageChoice: OpenImageChoice.FRIEND,
    levelOf3Dae: LevelOf3Dae.L2,
    motivations: ['WEIGHT_INCREASE', 'WEIGHT_LOSS', 'LONELINESS'],
    ableDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    districts: [
      { nameOfDong: '이태원1동', idOfGu: 2, nameOfGu: '용산구' },
      { nameOfDong: '이태원2동', idOfGu: 2, nameOfGu: '용산구' },
    ],
  },
  {
    role: Role.USER,
    email: 'ggg@gmail.com',
    nickname: 'ggg',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '7',
    openImageChoice: OpenImageChoice.FRIEND,
    levelOf3Dae: LevelOf3Dae.L3,
    motivations: ['WEIGHT_INCREASE', 'WEIGHT_LOSS', 'FIND_FRIEND'],
    ableDays: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'],
    districts: [
      { nameOfDong: '이태원1동', idOfGu: 2, nameOfGu: '용산구' },
      { nameOfDong: '이태원2동', idOfGu: 2, nameOfGu: '용산구' },
    ],
  },
  {
    role: Role.USER,
    email: 'hhh@gmail.com',
    nickname: 'hhh',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '8',
    openImageChoice: OpenImageChoice.FRIEND,
    levelOf3Dae: LevelOf3Dae.L3,
    motivations: ['WEIGHT_INCREASE', 'FIND_FRIEND', 'LONELINESS'],
    ableDays: ['MONDAY', 'TUESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
    districts: [
      { nameOfDong: '송파1동', idOfGu: 3, nameOfGu: '송파구' },
      { nameOfDong: '송파2동', idOfGu: 3, nameOfGu: '송파구' },
      { nameOfDong: '잠실4동', idOfGu: 3, nameOfGu: '송파구' },
    ],
  },
  {
    role: Role.USER,
    email: 'iii@gmail.com',
    nickname: 'iii',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '9',
    openImageChoice: OpenImageChoice.CLOSE,
    levelOf3Dae: LevelOf3Dae.L4,
    motivations: ['WEIGHT_LOSS', 'FIND_FRIEND', 'LONELINESS'],
    ableDays: [
      'MONDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ],
    districts: [
      { nameOfDong: '송파1동', idOfGu: 3, nameOfGu: '송파구' },
      { nameOfDong: '송파2동', idOfGu: 3, nameOfGu: '송파구' },
      { nameOfDong: '잠실4동', idOfGu: 3, nameOfGu: '송파구' },
    ],
  },
  {
    role: Role.USER,
    email: 'jjj@gmail.com',
    nickname: 'jjj',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '10',
    openImageChoice: OpenImageChoice.CLOSE,
    levelOf3Dae: LevelOf3Dae.L4,
    motivations: ['WEIGHT_LOSS', 'FIND_FRIEND', 'LONELINESS'],
    ableDays: [
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ],
    districts: [
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'kkk@gmail.com',
    nickname: 'kkk',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '11',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L4,
    motivations: [
      'WEIGHT_LOSS',
      'FIND_FRIEND',
      'LONELINESS',
    ],
    ableDays: [
      'WEDNESDAY',
      'THURSDAY',
      'SATURDAY',
    ],
    districts: [
      { nameOfDong: '개포1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '개포2동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '개포4동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'lll@gmail.com',
    nickname: 'lll',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '12',
    openImageChoice: OpenImageChoice.FRIEND,
    levelOf3Dae: LevelOf3Dae.L3,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
      'LONELINESS',
    ],
    ableDays: [
      'MONDAY',
      'WEDNESDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ],
    districts: [
      { nameOfDong: '일원1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '일원2동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '일원본동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'mmm@gmail.com',
    nickname: 'mmm',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '13',
    openImageChoice: OpenImageChoice.CLOSE,
    levelOf3Dae: LevelOf3Dae.L2,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
      'FIND_FRIEND',
    ],
    ableDays: [
      'MONDAY',
      'WEDNESDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ],
    districts: [
      { nameOfDong: '일원1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '일원2동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '일원본동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'nnn@gmail.com',
    nickname: 'nnn',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '14',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L1,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
      'LONELINESS',
    ],
    ableDays: [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
    ],
    districts: [
      { nameOfDong: '일원1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '일원2동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '일원본동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'ooo@gmail.com',
    nickname: 'ooo',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '15',
    openImageChoice: OpenImageChoice.FRIEND,
    levelOf3Dae: LevelOf3Dae.L4,
    motivations: [
      'WEIGHT_INCREASE',
      'FIND_FRIEND',
      'LONELINESS',
    ],
    ableDays: [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
    ],
    districts: [
      { nameOfDong: '청담동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'ppp@gmail.com',
    nickname: 'ppp',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '16',
    openImageChoice: OpenImageChoice.CLOSE,
    levelOf3Dae: LevelOf3Dae.L3,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
    ],
    ableDays: [
      'TUESDAY',
      'THURSDAY',
      'SATURDAY',
      'SUNDAY',
    ],
    districts: [
      { nameOfDong: '청담동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'qqq@gmail.com',
    nickname: 'qqq',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '17',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L2,
    motivations: [
      'WEIGHT_LOSS',
      'FIND_FRIEND',
    ],
    ableDays: [
      'TUESDAY',
      'THURSDAY',
      'SATURDAY',
      'SUNDAY',
    ],
    districts: [
      { nameOfDong: '청담동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'rrr@gmail.com',
    nickname: 'rrr',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '18',
    openImageChoice: OpenImageChoice.FRIEND,
    levelOf3Dae: LevelOf3Dae.L1,
    motivations: [
      'WEIGHT_INCREASE',
      'FIND_FRIEND',
    ],
    ableDays: [
      'MONDAY',
      'WEDNESDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ],
    districts: [
      { nameOfDong: '청담동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'sss@gmail.com',
    nickname: 'sss',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '19',
    openImageChoice: OpenImageChoice.CLOSE,
    levelOf3Dae: LevelOf3Dae.L4,
    motivations: [
      'FIND_FRIEND',
      'LONELINESS',
    ],
    ableDays: [
      'MONDAY',
      'WEDNESDAY',
      'FRIDAY',
    ],
    districts: [
      { nameOfDong: '청담동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '개포1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '개포2동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '개포4동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'ttt@gmail.com',
    nickname: 'ttt',
    gender: Gender.FEMALE,
    provider: Provider.GOOGLE,
    snsId: '20',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L3,
    motivations: [
      'WEIGHT_INCREASE',
      'LONELINESS',
    ],
    ableDays: [
      'SATURDAY',
      'SUNDAY',
    ],
    districts: [
      { nameOfDong: '개포1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '개포2동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '개포4동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'uuu@gmail.com',
    nickname: 'uuu',
    gender: Gender.FEMALE,
    provider: Provider.GOOGLE,
    snsId: '21',
    openImageChoice: OpenImageChoice.FRIEND,
    levelOf3Dae: LevelOf3Dae.L2,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
    ],
    ableDays: [
      'SATURDAY',
      'SUNDAY',
    ],
    districts: [
      { nameOfDong: '삼성1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '삼성2동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'vvv@gmail.com',
    nickname: 'vvv',
    gender: Gender.FEMALE,
    provider: Provider.GOOGLE,
    snsId: '22',
    openImageChoice: OpenImageChoice.CLOSE,
    levelOf3Dae: LevelOf3Dae.L1,
    motivations: [
      'WEIGHT_LOSS',
      'FIND_FRIEND',
      'LONELINESS',
    ],
    ableDays: [
      'FRIDAY',
    ],
    districts: [
      { nameOfDong: '삼성1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '삼성2동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'www@gmail.com',
    nickname: 'www',
    gender: Gender.FEMALE,
    provider: Provider.GOOGLE,
    snsId: '23',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L4,
    motivations: [
      'WEIGHT_INCREASE',
      'FIND_FRIEND',
      'LONELINESS',
    ],
    ableDays: [
      'THURSDAY',
    ],
    districts: [
      { nameOfDong: '삼성1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '삼성2동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'xxx@gmail.com',
    nickname: 'xxx',
    gender: Gender.FEMALE,
    provider: Provider.GOOGLE,
    snsId: '24',
    openImageChoice: OpenImageChoice.CLOSE,
    levelOf3Dae: LevelOf3Dae.L3,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
      'LONELINESS',
    ],
    ableDays: [
      'WEDNESDAY',
    ],
    districts: [
      { nameOfDong: '논현1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'yyy@gmail.com',
    nickname: 'yyy',
    gender: Gender.FEMALE,
    provider: Provider.GOOGLE,
    snsId: '25',
    openImageChoice: OpenImageChoice.FRIEND,
    levelOf3Dae: LevelOf3Dae.L2,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
      'FIND_FRIEND',
    ],
    ableDays: [
      'TUESDAY',
    ],
    districts: [
      { nameOfDong: '논현1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'zzz@gmail.com',
    nickname: 'zzz',
    gender: Gender.FEMALE,
    provider: Provider.GOOGLE,
    snsId: '26',
    openImageChoice: OpenImageChoice.FRIEND,
    levelOf3Dae: LevelOf3Dae.L1,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
      'FIND_FRIEND',
      'LONELINESS',
    ],
    ableDays: [
      'MONDAY',
    ],
    districts: [
      { nameOfDong: '논현1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: Role.USER,
    email: 'bfsudong@gmail.com',
    nickname: 'yg kwon',
    gender: Gender.MALE,
    provider: Provider.GOOGLE,
    snsId: '112259972247432337684',
    openImageChoice: OpenImageChoice.OPEN,
    levelOf3Dae: LevelOf3Dae.L1,
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
      'FIND_FRIEND',
      'LONELINESS',
    ],
    ableDays: [
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
      'SUNDAY',
    ],
    districts: [
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
];

export default users;
