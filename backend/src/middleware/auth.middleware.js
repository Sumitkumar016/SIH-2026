import { verifyAccessToken } from "../utils/jwt.js";

const sendUnauthorizedResponse = (res, message) => {
  return res.status(401).json({
    success: false,
    message,
  });
};

// protect checks whether a request has a valid JWT access token.
// It does not query MongoDB or perform role-based authorization.
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Private routes expect: Authorization: Bearer <token>
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return sendUnauthorizedResponse(res, "Authentication token is required.");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return sendUnauthorizedResponse(res, "Authentication token is required.");
  }

  try {
    const decoded = verifyAccessToken(token);

    // Attach only safe authentication data from the token for later middleware/controllers.
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };

    next();
  } catch (error) {
    // jsonwebtoken throws for expired, malformed, or otherwise invalid tokens.
    return sendUnauthorizedResponse(res, "Invalid or expired authentication token.");
  }
};
