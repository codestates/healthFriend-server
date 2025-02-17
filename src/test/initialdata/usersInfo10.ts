const usersInfo = [
  {
    role: 'USER',
    email: 'sooyoung@gmail.com',
    nickname: '차수영',
    gender: 'FEMALE',
    provider: 'GOOGLE',
    snsId: '20',
    openImageChoice: 'OPEN',
    levelOf3Dae: 'L3',
    motivations: ['WEIGHT_INCREASE', 'LONELINESS'],
    ableDays: ['SATURDAY', 'SUNDAY'],
    districts: [
      { nameOfDong: '개포1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '개포2동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '개포4동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: 'USER',
    email: 'doyoun@gmail.com',
    nickname: '윤도연',
    gender: 'FEMALE',
    provider: 'GOOGLE',
    snsId: '21',
    openImageChoice: 'FRIEND',
    levelOf3Dae: 'L2',
    motivations: ['WEIGHT_INCREASE', 'WEIGHT_LOSS'],
    ableDays: ['SATURDAY', 'SUNDAY'],
    districts: [
      { nameOfDong: '삼성1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '삼성2동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: 'USER',
    email: 'chaemin@gmail.com',
    nickname: '이채민',
    gender: 'FEMALE',
    provider: 'GOOGLE',
    snsId: '22',
    openImageChoice: 'CLOSE',
    levelOf3Dae: 'L1',
    motivations: ['WEIGHT_LOSS', 'FIND_FRIEND', 'LONELINESS'],
    ableDays: ['FRIDAY'],
    districts: [
      { nameOfDong: '삼성1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '삼성2동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: 'USER',
    email: 'jowoon@gmail.com',
    nickname: '김조운',
    gender: 'FEMALE',
    provider: 'GOOGLE',
    snsId: '23',
    openImageChoice: 'OPEN',
    levelOf3Dae: 'L4',
    motivations: ['WEIGHT_INCREASE', 'FIND_FRIEND', 'LONELINESS'],
    ableDays: ['THURSDAY'],
    districts: [
      { nameOfDong: '삼성1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '삼성2동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: 'USER',
    email: 'sohyung@gmail.com',
    nickname: '박소형',
    gender: 'FEMALE',
    provider: 'GOOGLE',
    snsId: '24',
    openImageChoice: 'CLOSE',
    levelOf3Dae: 'L3',
    motivations: ['WEIGHT_INCREASE', 'WEIGHT_LOSS', 'LONELINESS'],
    ableDays: ['WEDNESDAY'],
    districts: [
      { nameOfDong: '논현1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: 'USER',
    email: 'haein@gmail.com',
    nickname: '강해인',
    gender: 'FEMALE',
    provider: 'GOOGLE',
    snsId: '25',
    openImageChoice: 'FRIEND',
    levelOf3Dae: 'L2',
    motivations: ['WEIGHT_INCREASE', 'WEIGHT_LOSS', 'FIND_FRIEND'],
    ableDays: ['TUESDAY'],
    districts: [
      { nameOfDong: '논현1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: 'USER',
    email: 'yihyoun@gmail.com',
    nickname: '한이현',
    gender: 'FEMALE',
    provider: 'GOOGLE',
    snsId: '26',
    openImageChoice: 'FRIEND',
    levelOf3Dae: 'L1',
    motivations: [
      'WEIGHT_INCREASE',
      'WEIGHT_LOSS',
      'FIND_FRIEND',
      'LONELINESS',
    ],
    ableDays: ['MONDAY'],
    districts: [
      { nameOfDong: '논현1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치1동', idOfGu: 1, nameOfGu: '강남구' },
      { nameOfDong: '대치2동', idOfGu: 1, nameOfGu: '강남구' },
    ],
  },
  {
    role: 'USER',
    email: 'bfsudong@gmail.com',
    nickname: 'yg kwon',
    gender: 'MALE',
    provider: 'GOOGLE',
    snsId: '112259972247432337684',
    openImageChoice: 'OPEN',
    levelOf3Dae: 'L1',
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
    role: 'USER',
    email: 'angelxtry@gmail.com',
    nickname: 'Suho Lee',
    gender: 'MALE',
    provider: 'GOOGLE',
    snsId: '115844759011217945058',
    openImageChoice: 'OPEN',
    levelOf3Dae: 'L1',
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
    role: 'USER',
    email: 'legendarysuho@gmail.com',
    nickname: 'suho legend',
    gender: 'MALE',
    provider: 'GOOGLE',
    snsId: '105923364640816320608',
    openImageChoice: 'OPEN',
    levelOf3Dae: 'L1',
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

export default usersInfo;
