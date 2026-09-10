import dotenv from "dotenv";

// Load key-value pairs from the .env file into process.env before accessing them.
dotenv.config();

// List of environment variables that must be present for the app to function.
const requiredEnvVariables = ["DATABASE_URL", "JWT_SECRET"];

// Find any required variables that are missing or empty.
const missingEnvVariables = [];

for (const key of requiredEnvVariables) {
  const value = process.env[key];
  if (!value || value.trim() === "") {
    missingEnvVariables.push(key);
  }
}

// Stop startup immediately if any essential configuration is missing.
if (missingEnvVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVariables.join(", ")}`
  );
}

// Helper function to safely parse and validate the server port number.
function parsePort(value) {
  const defaultPort = 5000;
  const port = Number(value || defaultPort);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive number.");
  }

  return port;
}

// Consolidated application configuration object.
// Object.freeze prevents accidental modification of config properties at runtime.
const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",
  port: parsePort(process.env.PORT),
  databaseUrl: process.env.DATABASE_URL.trim(),
  jwtSecret: process.env.JWT_SECRET.trim(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "*",
});

export default config;
