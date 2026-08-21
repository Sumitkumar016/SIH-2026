import express from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./config/env.js";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Parse incoming JSON request bodies so controllers can read req.body later.
app.use(express.json());

// Allow frontend requests. The origin can be restricted through CORS_ORIGIN.
app.use(
  cors({
    origin: config.corsOrigin,
  })
);

// Add basic security headers for the Express application.
app.use(helmet());

// Simple health route to confirm the API server is running.
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SIH backend is running",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// Authentication routes are mounted under one clear API prefix.
app.use("/api/auth", authRoutes);

// Send unknown routes to the centralized error middleware.
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// Global error middleware must be registered after all routes.
app.use(errorMiddleware);

export default app;
