import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();
const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_PORT, DB_DATABASE } =
  process.env;
export default new DataSource({
  type: "mysql",
  host: DB_HOST,
  port: Number(DB_PORT),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  // entities: [__dirname + '/src/database/entities/*.{ts,js}'],
  entities: [__dirname + '/src/controllers/*/entity/*.entity.{ts,js}'],
  migrations: [__dirname + '/src/database/migrations/*{.ts,.js}'],
  extra: { insecureAuth: true }
} as DataSourceOptions);