import config from "../config/env.js";

const statusMessages = {
  400: "Bad request.",
  401: "Unauthorized.",
  403: "Forbidden.",
  404: "Resource not found.",
  409: "Conflict.",
  500: "Internal server error.",
};

const getStatusCode = (err, res) => {
  if (err.statusCode) return err.statusCode;
  if (err.status) return err.status;
  if (res.statusCode && res.statusCode !== 200) return res.statusCode;
  return 500;
};

// Centralized Express error handler.
// The four parameters are required so Express recognizes this as error middleware.
const errorMiddleware = (err, req, res, next) => {
  const statusCode = getStatusCode(err, res);
  const isProduction = config.nodeEnv === "production";

  // Log useful details while developing without leaking them to API clients.
  if (!isProduction) {
    console.error("Error middleware caught an error:", {
      message: err.message,
      statusCode,
      method: req.method,
      path: req.originalUrl,
      stack: err.stack,
    });
  }

  const message =
    isProduction && statusCode === 500
      ? statusMessages[500]
      : err.message || statusMessages[statusCode] || statusMessages[500];

  const response = {
    success: false,
    message,
  };

  // Include stack traces only in development to avoid exposing internals.
  if (!isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default errorMiddleware;
