import jwt from "jsonwebtoken";
import config from "../config/env.js";

// Create an access token with only non-sensitive user information.
// Never include password, email verification data, or private profile details here.
export const generateAccessToken = (user) => {
  const payload = {
    userId: user._id.toString(),
    role: user.role,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

// Verify the access token and return the decoded payload if it is valid.
// jsonwebtoken will throw if the token is missing, expired, or invalid.
export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};
