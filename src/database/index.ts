import { getConnectionOptions, createConnection, Connection } from 'typeorm';
// eslint-disable-next-line max-len
import { ExerciseAbleDaysRepository } from './repositories/ExerciseAbleDaysRepository';
import { MotivationsRepository } from './repositories/MotivationsRepository';
import { UserRepository } from './repositories/UserRepository';
import { DistrictRepository } from './repositories/DistrictRepository';
// eslint-disable-next-line max-len
import { AbleDistrictsRepository } from './repositories/AbleDistrictsRepository';

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

export const getAbleDistrictsRepository = (): AbleDistrictsRepository =>
  connection.getCustomRepository(AbleDistrictsRepository);

export default connectDB;
