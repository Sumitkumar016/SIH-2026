import mongoose from "mongoose";
import config from "./env.js";

// connectDB creates one reusable MongoDB connection for the backend.
// Call this once from the server startup file before accepting requests.
const connectDB = async () => {
  try {
    const connection = await mongoose.connect(config.mongoUri);

    console.log(`MongoDB connected successfully: ${connection.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);

    // Stop the app if the database is unavailable during startup.
    process.exit(1);
  }
};

export default connectDB;
