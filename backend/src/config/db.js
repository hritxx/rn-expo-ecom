import mongoose from "mongoose";
import { ENV } from "./env.js";

const DB_URL = ENV.DB_URL;

let isConnected = false;

export const connectDB = async () => {
  try {
    if (isConnected) return;
    const conn = await mongoose.connect(DB_URL);
    console.log(`Connected to MongoDB: ${conn.connection.host}`);
    isConnected = conn.connections[0].readyState === 1;
  } catch (dbError) {
    console.log("Error connecting to the database", dbError);
    process.exit(1);
  }
};
