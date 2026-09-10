// Re-export authentication and authorization middleware from auth.js.
// This allows route files to import from either auth.middleware.js or auth.js consistently.
export { protect, restrictTo, default } from "./auth.js";
