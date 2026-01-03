import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  DB_URL: process.env.DB_URL,
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY,
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
};

if (!ENV.CLERK_PUBLISHABLE_KEY || !ENV.CLERK_SECRET_KEY) {
  console.warn(
    "Warning: CLERK_PUBLISHABLE_KEY and/or CLERK_SECRET_KEY are not set"
  );
}

if (!ENV.DB_URL) {
  console.warn("Warning: DB_URL is not set in environment variables");
}
