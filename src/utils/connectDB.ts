import { getConnectionOptions, createConnection, Connection } from 'typeorm';
import { MotivationsRepository } from '../Repositories/MotivationsRepository';
import { UserRepository } from '../Repositories/userRepository';

let connection: Connection;

const connectDB = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  connection = await createConnection({
    ...connectionOptions,
    name: 'default',
  });
  return connection;
};

export const getUserRepository = (): UserRepository =>
  connection.getCustomRepository(UserRepository);

// eslint-disable-next-line max-len
export const getMotivationRepository = (): MotivationsRepository =>
  connection.getCustomRepository(MotivationsRepository);

export default connectDB;
