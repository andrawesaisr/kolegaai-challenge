import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.DATABASE_URL);
export const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  logging: false,
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
