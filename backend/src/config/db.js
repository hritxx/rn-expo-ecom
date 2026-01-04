import mongoose from "mongoose";
import { ENV } from "./env.js";

const DB_URL = ENV.DB_URL;

let isConnected = false;
let connectionPromise = null;

export const connectDB = async () => {
  try {
    if (isConnected) {
      console.log("Using existing MongoDB connection");
      return mongoose.connection;
    }

    if (connectionPromise) {
      console.log("Awaiting existing connection promise");
      return await connectionPromise;
    }

    // const conn = await mongoose.connect(DB_URL);
    // console.log(`Connected to MongoDB: ${conn.connection.host}`);

    // isConnected = conn.connection.readyState === 1;
    // return conn.connection;

    connectionPromise = mongoose.connect(DB_URL).then((conn) => {
      console.log(`Connected to MongoDB: ${conn.connection.host}`);
      isConnected = conn.connection.readyState === 1;
      return conn.connection;
    });

    return await connectionPromise;
  } catch (dbError) {
    console.error("Error connecting to the database", dbError);
    connectionPromise = null;

    throw dbError;
  }
};
