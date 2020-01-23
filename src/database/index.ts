import { getConnectionOptions, createConnection, Connection } from 'typeorm';
import { ExerciseAbleDaysRepository } from './repositories/ExerciseAbleDays';
import { MotivationsRepository } from './repositories/Motivations';
import { UserRepository } from './repositories/User';
import { DistrictRepository } from './repositories/District';
import { AbleDistrictsRepository } from './repositories/AbleDistricts';
import { FriendsRepository } from './repositories/Friends';
import { FollowerRepository } from './repositories/Follow';
import { ImageRepository } from './repositories/Image';

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

export const getFriendsRepository = (): FriendsRepository =>
  connection.getCustomRepository(FriendsRepository);

export const getFollowRepository = (): FollowerRepository =>
  connection.getCustomRepository(FollowerRepository);

export const getImageRepo = (): ImageRepository =>
  connection.getCustomRepository(ImageRepository);

export default connectDB;
