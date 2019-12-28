import { getConnectionOptions, createConnection, Connection } from 'typeorm';
import {
  ExerciseAbleDaysRepository,
} from '../Repositories/ExerciseAbleDaysRepository';
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

export const getMotivationRepository = (): MotivationsRepository =>
  connection.getCustomRepository(MotivationsRepository);

export const getExerciseAbleDaysRepository = (): ExerciseAbleDaysRepository =>
  connection.getCustomRepository(ExerciseAbleDaysRepository);

export default connectDB;
