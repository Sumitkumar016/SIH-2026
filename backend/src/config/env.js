import dotenv from "dotenv";

// Load variables from the .env file into process.env before reading them.
dotenv.config();

const requiredEnvVariables = ["MONGO_URI", "JWT_SECRET"];

const missingEnvVariables = requiredEnvVariables.filter((key) => {
  const value = process.env[key];
  return !value || value.trim() === "";
});

// Fail early with a clear message if an important setting is missing.
if (missingEnvVariables.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVariables.join(", ")}`
  );
}

const parsePort = (value) => {
  const port = Number(value || 5000);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("PORT must be a positive number.");
  }

  return port;
};

const config = Object.freeze({
  nodeEnv: process.env.NODE_ENV || "development",
  port: parsePort(process.env.PORT),
  mongoUri: process.env.MONGO_URI.trim(),
  jwtSecret: process.env.JWT_SECRET.trim(),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  corsOrigin: process.env.CORS_ORIGIN || "*",
});

export default config;
