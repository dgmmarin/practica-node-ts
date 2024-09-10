import "reflect-metadata";
import { DataSource } from "typeorm";
import path from "path";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  username: process.env.DB_USERNAME || "test",
  password: process.env.DB_PASSWORD || "test",
  database: process.env.DB_DATABASE || "test",
  synchronize: process.env.DB_SYNC == "true" ? true : false,
  logging: process.env.DB_LOGGING == "true" ? true : false,
  entities: [path.join(__dirname, "database/entities", "*.ts")],
  // entities: [path.join(__dirname, "controllers", "*/entity/*.entity.ts")],
  migrations: [path.join(__dirname, "database/migrations", "*.ts")],
  // subscribers: [path.join(__dirname, "database/subscribers", "*.ts")],
  migrationsTableName: "migrations",
});