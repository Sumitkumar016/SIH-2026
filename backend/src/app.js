import express from "express";
import cors from "cors";
import helmet from "helmet";
import config from "./config/env.js";
import errorMiddleware from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.routes.js";
import ministryRoutes from "./routes/ministry.routes.js";
import workRoutes from "./routes/work.routes.js";
import mpRoutes from "./routes/mp.routes.js";
import districtRoutes from "./routes/district.routes.js";
import stateRoutes from "./routes/state.routes.js";
import auditorRoutes from "./routes/auditor.routes.js";

/**
 * Express application definition and middleware pipeline.
 * Separated from server.js so it can be imported in integration tests without binding to a network port.
 */
const app = express();

// 1. Core security and parsing middleware
app.use(express.json());
app.use(
  cors({
    origin: config.corsOrigin,
  })
);
app.use(helmet());

// 2. Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SIH backend is running",
    environment: config.nodeEnv,
    timestamp: new Date().toISOString(),
  });
});

// 3. Application API routes
app.use("/api/auth", authRoutes);

// Ministry routes
app.use("/api/ministry", ministryRoutes);

// Work Detail routes (shared across all authenticated roles)
app.use("/api/works", workRoutes);

// MP routes (scoped to authenticated MP)
app.use("/api/mp", mpRoutes);

// District routes (scoped to authenticated District official)
app.use("/api/district", districtRoutes);

// State routes (scoped to authenticated State Nodal official)
app.use("/api/state", stateRoutes);

// Auditor routes (scoped to authenticated Auditor)
app.use("/api/auditor", auditorRoutes);


// Send unknown routes to the centralized error middleware.
app.use((req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
});

// 5. Centralized global error handling middleware (must always be registered last)
app.use(errorMiddleware);

export default app;
