import { PrismaClient } from "@prisma/client";
import config from "./env.js";

// Determine which Prisma log levels to show based on environment.
// In development, show queries, errors, and warnings. In production, only errors.
const logLevels = config.nodeEnv === "development" 
  ? ["query", "error", "warn"] 
  : ["error"];

// Create a single PrismaClient instance (singleton) for the entire application.
// Creating multiple instances can exhaust the database connection pool.
const prisma = new PrismaClient({
  log: logLevels,
});

// Test and verify the PostgreSQL connection during server startup.
async function connectDB() {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected successfully via Prisma");
  } catch (error) {
    console.error(`PostgreSQL connection failed: ${error.message}`);
    // Exit the process if the database cannot be reached at startup.
    process.exit(1);
  }
}

// Cleanly disconnect from Prisma when the server process is terminated.
async function handleGracefulShutdown(signal) {
  console.log(`Received ${signal}. Disconnecting Prisma client...`);
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error(`Error during Prisma disconnect: ${err.message}`);
  } finally {
    process.exit(0);
  }
}

// Listen for termination signals (e.g., Ctrl+C in terminal, Docker stop).
process.on("SIGINT", () => handleGracefulShutdown("SIGINT"));
process.on("SIGTERM", () => handleGracefulShutdown("SIGTERM"));

export { prisma, connectDB };
export default connectDB;
