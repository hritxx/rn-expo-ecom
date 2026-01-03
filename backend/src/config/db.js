// import mongoose from "mongoose";
// import { ENV } from "./env.js";

// const DB_URL = ENV.DB_URL;

// if (!DB_URL) {
//   throw new Error("Missing DB_URL environment variable");
// }

// // ---- global cache ----
// let cached = global.mongoose;

// if (!cached) {
//   cached = global.mongoose = {
//     conn: null,
//     promise: null,
//     createdAt: Date.now(),
//   };
//   console.log("[DB] Global cache initialized (cold start)");
// } else {
//   console.log("[DB] Global cache reused (warm start)");
// }

// export const connectDB = async () => {
//   // Reuse existing connection
//   if (cached.conn) {
//     console.log("[DB] Using existing MongoDB connection");
//     return cached.conn;
//   }

//   // Reuse in-flight connection promise
//   if (!cached.promise) {
//     console.log("[DB] Creating new MongoDB connection promise");

//     cached.promise = mongoose
//       .connect(DB_URL, {
//         bufferCommands: false,
//       })
//       .then((mongooseInstance) => {
//         console.log("[DB] MongoDB connected successfully");
//         console.log(
//           "[DB] Connection readyState:",
//           mongooseInstance.connection.readyState
//         );
//         return mongooseInstance;
//       });
//   } else {
//     console.log("[DB] Awaiting existing connection promise");
//   }

//   try {
//     cached.conn = await cached.promise;
//     return cached.conn;
//   } catch (error) {
//     console.error("[DB] MongoDB connection failed");
//     cached.promise = null;
//     throw error;
//   }
// };

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
    console.error("Error connecting to the database", dbError);
    throw dbError;
  }
};
