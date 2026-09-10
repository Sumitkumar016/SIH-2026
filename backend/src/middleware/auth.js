import { verifyAccessToken } from "../utils/jwt.js";

/**
 * Authentication Middleware:
 * Verifies that the incoming request contains a valid JWT in the Authorization header.
 * 
 * 1. Checks for header format: "Authorization: Bearer <token>"
 * 2. Verifies the token signature using the secret key.
 * 3. Attaches the decoded user data (e.g. userId, role) to req.user for downstream handlers.
 * 4. Returns 401 Unauthorized if the token is missing, invalid, or expired.
 */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // The client must send: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required.",
    });
  }

  // Extract the token string after the word "Bearer "
  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required.",
    });
  }

  try {
    // verifyAccessToken will throw an error if the token has expired or was tampered with
    const decodedUser = verifyAccessToken(token);
    
    // Store decoded user payload on the request object so subsequent middleware/controllers can access it
    req.user = decodedUser;
    
    // Continue to the next middleware or controller
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired authentication token.",
    });
  }
}

/**
 * Authorization Middleware (Role-Based Access Control):
 * Restricts access to one or more specified roles (e.g. "ministry", "mp", "district", "state", "auditor").
 * Must be used AFTER protect middleware so that req.user is already populated.
 *
 * Example usage: restrictTo("ministry", "auditor")
 */
export function restrictTo(...allowedRoles) {
  return function (req, res, next) {
    // Check if the authenticated user's role is in the list of allowed roles
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
    }

    // User has permission, proceed to next handler
    next();
  };
}

export default { protect, restrictTo };
