import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL: process.env.DB_URL,
};

if (!ENV.DB_URL) {
  console.warn("Warning: DB_URL is not set in environment variables");
}
