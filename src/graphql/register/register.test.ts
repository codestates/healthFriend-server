import { request } from 'graphql-request';
import { Connection } from 'typeorm';
import connectDB, { getUserRepository } from '../../database';
import { getUserInfoFromToken } from '../../utils/controllToken';
import { registerMutation } from '../../test/graphql.schema';

let conn: Connection;
beforeAll(async () => {
  conn = await connectDB();
});
afterAll(async () => {
  await conn.close();
});

describe('register Mutation', () => {
  it('must return a token', async () => {
    const email = 'abcd@gmail.com';
    const password = 'abcd';
    getUserRepository().deleteUserByEmail(email);
    const response = await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password),
    );
    // console.log('RESPONSE: ', response.registerForTest);
    const userInfo = getUserInfoFromToken(response.registerForTest.token);
    expect(userInfo.email).toEqual(email);
  });
});
