/**
 * utils/asyncHandler.js
 * 
 * In Express, if an asynchronous route handler throws an error or rejects a Promise,
 * it won't be caught automatically unless wrapped in try/catch or forwarded with next(err).
 * 
 * asyncHandler wraps an async controller function so any unhandled rejection
 * is automatically passed to Express's next() error handling middleware.
 *
 * Example usage:
 * router.get("/my-route", asyncHandler(async (req, res) => { ... }));
 */
export function asyncHandler(fn) {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default asyncHandler;
