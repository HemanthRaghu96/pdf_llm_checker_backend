import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { CheckResults } from "../checkResults/checkResults.entity";
dotenv.config();
export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
  entities: [CheckResults],
});
