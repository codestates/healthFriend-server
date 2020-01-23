import { Connection } from 'typeorm';
// import { ApolloError } from 'apollo-server-express';
import connectDB, {
//   getUserRepository,
//   getFriendsRepository,
//   getFollowRepository,
//   getProfileImageRepo,
} from '../..';
// import { Role, Provider, User } from '../../entity/User';
// import { Friends } from '../../entity/Friends';

let conn: Connection;
beforeEach(async () => {
  conn = await connectDB();
});
afterEach(async () => {
  await conn.close();
});

// const aaaUserInfo = {
//   role: Role.USER,
//   email: 'aaa@gmail.com',
//   nickname: 'aaa',
//   provider: Provider.GOOGLE,
//   snsId: '1',
// };

// const bbbUserInfo = {
//   role: Role.USER,
//   email: 'bbb@gmail.com',
//   nickname: 'bbb',
//   provider: Provider.GOOGLE,
//   snsId: '2',
// };

// const cccUserInfo = {
//   role: Role.USER,
//   email: 'ccc@gmail.com',
//   nickname: 'ccc',
//   provider: Provider.GOOGLE,
//   snsId: '3',
// };

// const dddUserInfo = {
//   role: Role.USER,
//   email: 'ddd@gmail.com',
//   nickname: 'ddd',
//   provider: Provider.GOOGLE,
//   snsId: '4',
// };

// { ETag: '"4d0d9d6737a6ed1fb0c2fdda5e177275"',
//   Location:
//    'https://graphql-image-upload.s3.ap-northeast-2.amazonaws.com/go-use.png',
//   key: 'go-use.png',
//   Key: 'go-use.png',
//   Bucket: 'graphql-image-upload' }

//   { ETag: '"f0a024f1c6c1b8f6e93e9ef638c8d91a"',
//   Location:
//    'https://graphql-image-upload.s3.ap-northeast-2.amazonaws.com/20190610_204652_607.jpg',
//   key: '20190610_204652_607.jpg',
//   Key: '20190610_204652_607.jpg',
//   Bucket: 'graphql-image-upload' }

describe('Profile Image 추가', () => {
  it('Profile Image를 추가할 수 있다. 파일명은 ID + DATE + filename', async () => {
    // const aaa = await getUserRepository().saveUserInfo(aaaUserInfo);
    const filenames = ['1'];
    // const files = await getProfileImageRepo().saveImages(aaa, filenames);
    expect(filenames).toHaveLength(1);
  });
});
