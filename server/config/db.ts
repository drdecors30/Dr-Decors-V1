import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;
let isMockDB = true;

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  console.log("=================================");
  console.log("Mongo URI:", uri);
  console.log("=================================");

  if (!uri) {
    console.log(
      "ℹ️ MONGODB_URI is not defined in .env. Using secure Local JSON storage."
    );
    isMockDB = true;
    return false;
  }

  const options = {
    autoIndex: true,
    serverSelectionTimeoutMS: 3000,
    socketTimeoutMS: 30000,
  };

  let retries = 2;

  while (retries > 0) {
    try {
      console.log(`Connecting to MongoDB... (Attempts left: ${retries})`);

      await mongoose.connect(uri, options);

      isConnected = true;
      isMockDB = false;

      console.log("=================================");
      console.log("✅ Connected to MongoDB Atlas successfully.");
      console.log("Connected DB:", mongoose.connection.db?.databaseName);
      console.log("Host:", mongoose.connection.host);
      console.log("Connection State:", mongoose.connection.readyState);
      console.log("=================================");

      return true;
    } catch (error: any) {
      console.error("========== FULL MONGODB ERROR ==========");
      console.error(error);
      console.error("========================================");

      console.log(
        `ℹ️ MongoDB connection attempt failed: ${error?.message || error}`
      );

      retries--;

      if (retries === 0) {
        console.log(
          "⚠️ Could not connect to MongoDB Atlas. Using secure Local JSON storage for uninterrupted preview."
        );
        isMockDB = true;
        return false;
      }

      // Wait 1 second before retrying
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  isMockDB = true;
  return false;
}

export function disconnectDB() {
  return mongoose.disconnect();
}

export function getDBMode() {
  return {
    isConnected,
    isMockDB,
    readyState: mongoose.connection.readyState,
    database: mongoose.connection.db?.databaseName,
    host: mongoose.connection.host,
  };
}