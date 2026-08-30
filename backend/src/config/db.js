import { PrismaClient } from "@prisma/client";
import config from "./env.js";

// Instantiate a single PrismaClient singleton to prevent exhausting connection pool limits.
const prisma = new PrismaClient({
  log:
    config.nodeEnv === "development"
      ? ["query", "error", "warn"]
      : ["error"],
});

// connectDB tests and verifies the PostgreSQL connection via Prisma Client during startup.
const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("PostgreSQL connected successfully via Prisma");
  } catch (error) {
    console.error(`PostgreSQL connection failed: ${error.message}`);
    // Stop the app if the database is unavailable during startup.
    process.exit(1);
  }
};

// Graceful shutdown handling for clean disconnect on server termination.
const handleGracefulShutdown = async (signal) => {
  console.log(`Received ${signal}. Disconnecting Prisma client...`);
  try {
    await prisma.$disconnect();
  } catch (err) {
    console.error(`Error during Prisma disconnect: ${err.message}`);
  } finally {
    process.exit(0);
  }
};

process.on("SIGINT", () => handleGracefulShutdown("SIGINT"));
process.on("SIGTERM", () => handleGracefulShutdown("SIGTERM"));

export { prisma, connectDB };
export default connectDB;
