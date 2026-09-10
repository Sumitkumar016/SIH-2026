import config from "../config/env.js";

// Default user-friendly messages corresponding to common HTTP error status codes.
const statusMessages = {
  400: "Bad request.",
  401: "Unauthorized.",
  403: "Forbidden.",
  404: "Resource not found.",
  409: "Conflict.",
  500: "Internal server error.",
};

// Determines the HTTP status code from the error object or existing response status.
function getStatusCode(err, res) {
  if (err.statusCode) return err.statusCode;
  if (err.status) return err.status;
  if (res.statusCode && res.statusCode !== 200) return res.statusCode;
  return 500;
}

/**
 * Centralized Express Error Handling Middleware.
 * 
 * IMPORTANT: Express identifies this as an error handler because it has exactly 4 arguments:
 * (err, req, res, next). All 4 arguments must be defined even if 'next' is not used directly.
 */
function errorMiddleware(err, req, res, next) {
  const statusCode = getStatusCode(err, res);
  const isProduction = config.nodeEnv === "production";

  // In development, log full error details to the terminal for easier debugging.
  if (!isProduction) {
    console.error("Error middleware caught an error:", {
      message: err.message,
      statusCode,
      method: req.method,
      path: req.originalUrl,
      stack: err.stack,
    });
  }

  // Determine the response message.
  // In production, mask unhandled 500 server errors so internal details/code aren't leaked.
  let message = err.message || statusMessages[statusCode] || statusMessages[500];
  if (isProduction && statusCode === 500) {
    message = statusMessages[500];
  }

  const response = {
    success: false,
    message,
  };

  // Include stack traces only in development to assist local troubleshooting.
  if (!isProduction) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

export default errorMiddleware;
