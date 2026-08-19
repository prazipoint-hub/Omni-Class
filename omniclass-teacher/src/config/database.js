import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL || null;
const envDialect = process.env.DB_DIALECT || null;

const detectedDialect = envDialect
  || (dbUrl && dbUrl.startsWith("mysql"))
  || (dbUrl && dbUrl.includes("mysql://"))
  ? "mysql"
  : "postgres";

export const sequelize = new Sequelize(
  process.env.DATABASE_URL,
  {
    dialect: detectedDialect,
    logging: false,
    dialectOptions:
      process.env.NODE_ENV === "production"
        ? detectedDialect === "postgres"
          ? {
              ssl: {
                require: true,
                rejectUnauthorized: false
              }
            }
          : {}
        : {}
  }
);
