import { Sequelize } from "sequelize";
process.loadEnvFile();
const db = new Sequelize(
  process.env.DB_SCHEMA,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: "junction.proxy.rlwy.net",
    dialect: "mysql",
  }
);

export default db;
