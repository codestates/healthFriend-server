import { getConnectionOptions, createConnection, Connection } from 'typeorm';
import {
  ExerciseAbleDaysRepository,
} from './repositories/ExerciseAbleDaysRepository';
import { MotivationsRepository } from './repositories/MotivationsRepository';
import { UserRepository } from './repositories/UserRepository';
import { DistrictRepository } from './repositories/DistrictRepository';

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

export const getDistrictRepository = (): DistrictRepository =>
  connection.getCustomRepository(DistrictRepository);

export default connectDB;
