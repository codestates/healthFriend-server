import { request } from 'graphql-request';
import { Connection } from 'typeorm';
import connectDB, { getUserRepository } from '../../database';
import { getUserInfoFromToken } from '../../utils/controllToken';
import { registerMutation, loginQuery } from '../../test/graphql.schema';

let conn: Connection;
beforeAll(async () => {
  conn = await connectDB();
});
afterAll(async () => {
  await conn.close();
});

describe('login Query', () => {
  it('must return a token', async () => {
    const email = 'abcd@gmail.com';
    const password = 'abcd';
    getUserRepository().deleteUserByEmail(email);
    await request(
      process.env.TEST_HOST as string,
      registerMutation(email, password),
    );
    const response = await request(
      process.env.TEST_HOST as string,
      loginQuery(email, password),
    );
    const userInfo = getUserInfoFromToken(response.login.token);
    expect(userInfo.email).toEqual(email);
  });
});
