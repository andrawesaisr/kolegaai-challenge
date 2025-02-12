import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.DATABASE_URL);
export const sequelize = new Sequelize({
  dialect: "postgres",
  logging: false,
  username: "postgres",
  password: "X0O1dXpxePlb7Q6e14Ba",
  host: "pgdb.cjw28suymca0.us-east-1.rds.amazonaws.com",
  port: 5432,
  database: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // This should only be used for testing, not production
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
