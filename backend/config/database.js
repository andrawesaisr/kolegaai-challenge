import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize({
  dialect: "postgres",
  logging: false,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  database: process.env.DATABASE_NAME,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

export const initDatabase = async () => {
  try {
    await sequelize.authenticate();

    await sequelize.sync();
    console.log("Database synchronized");
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};
