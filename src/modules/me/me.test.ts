import { request } from 'graphql-request';
import axios from 'axios';
import { Connection } from 'typeorm';
import { AuthenticationError } from 'apollo-server-express';
import { DetailedUserInfo } from '../../types/User.types';
import connectDB, { getUserRepository } from '../../database';
import {
  Gender,
  OpenImageChoice,
  LevelOf3Dae,
} from '../../database/entity/User';
import {
  registerMutation,
  meQuery,
  meMutation,
} from '../../test/graphql.schema';

let conn: Connection;
beforeAll(async () => {
  conn = await connectDB();
});
afterAll(async () => {
  await conn.close();
});

const host = process.env.TEST_HOST as string;
const user1 = 'abc@gmail.com';

describe('me Query', () => {
  it('no token', async () => {
    expect(async () =>
      (await request(host, meQuery)).toThrow(AuthenticationError));
  });
  it('has token', async () => {
    await getUserRepository().deleteUserByEmail(user1);
    const response = await request(host, registerMutation(user1));
    const { token } = response.registerForTest;
    // console.log('RESPONSE', token);
    const result = await axios.post(
      host,
      {
        query: meQuery,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    // console.log(result.data);
    expect(result.data.data).toEqual({
      me: {
        email: user1,
        nickname: user1,
      },
    });
  });
});

describe('me Mutation', () => {
  it('must return user object', async () => {
    const expectData: DetailedUserInfo = {
      nickname: 'abc',
      gender: Gender.FEMALE,
      openImageChoice: OpenImageChoice.CLOSE,
      levelOf3Dae: LevelOf3Dae.L3,
      messageToFriend: 'Hello',
    };
    await getUserRepository().deleteUserByEmail(user1);
    const user1Add = await request(host, registerMutation(user1));
    const { token } = user1Add.registerForTest;
    // console.log(token);

    // console.log('ME MUTATION: ', meMutation(expectData));
    const result = await axios.post(
      host,
      { query: meMutation(expectData) },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    // console.log(result.data.data);
    const { me } = result.data.data;
    expect(me.email).toEqual(user1);
    expect(me.nickname).toEqual(expectData.nickname);
    expect(me.gender).toEqual(expectData.gender);
    expect(me.openImageChoice).toEqual(expectData.openImageChoice);
    expect(me.levelOf3Dae).toEqual(expectData.levelOf3Dae);
    expect(me.messageToFriend).toEqual(expectData.messageToFriend);
  });
});
