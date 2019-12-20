import { getConnectionOptions, createConnection } from 'typeorm';

const connectDB = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({ ...connectionOptions, name: 'default' });
};

export default connectDB;
