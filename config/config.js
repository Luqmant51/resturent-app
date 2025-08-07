const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, "../.env") });

const config = {
  app: {
    port: process.env.PORT,
  },
  database: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME,
    dialect: process.env.DB_DIALECT || "mysql",
  },
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
};

module.exports = config;
