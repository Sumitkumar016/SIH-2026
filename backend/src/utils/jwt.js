import jwt from "jsonwebtoken";
import config from "../config/env.js";

/**
 * Generate an access token containing core user authorization attributes.
 * Expiry is 8 hours.
 */
export const generateAccessToken = (user) => {
  const payload = {
    user_id: user.user_id,
    name: user.name,
    role: user.role,
    mp_id: user.mp_id,
    district_id: user.district_id,
    state_id: user.state_id,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || config.jwtSecret, {
    expiresIn: "8h",
  });
};

/**
 * Verify access token and return decoded payload.
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET || config.jwtSecret);
};
