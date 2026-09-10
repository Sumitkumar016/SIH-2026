import jwt from "jsonwebtoken";
import config from "../config/env.js";

/**
 * Generates a signed JWT access token containing essential user attributes.
 * The token is valid for 8 hours.
 *
 * @param {Object} user - User record from the database
 * @returns {string} Signed JWT token string
 */
export function generateAccessToken(user) {
  const payload = {
    user_id: user.user_id,
    name: user.name,
    role: user.role,
    mp_id: user.mp_id,
    district_id: user.district_id,
    state_id: user.state_id,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: "8h",
  });
}

/**
 * Verifies the signature and validity of an incoming JWT token.
 * Throws an error if the token has expired or was tampered with.
 *
 * @param {string} token - Bearer token extracted from request header
 * @returns {Object} Decoded user payload
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

export default {
  generateAccessToken,
  verifyAccessToken,
};
