import bcrypt from "bcryptjs";

// Number of hashing algorithm rounds (higher = more secure, but slower)
const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password before saving it to the database.
 * Raw passwords should never be saved in plaintext.
 *
 * @param {string} password - Plaintext password
 * @returns {Promise<string>} Hashed password string
 */
export async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compares a plaintext password attempt with the hashed password stored in the database.
 * Returns true if the password matches, false otherwise.
 *
 * @param {string} password - Plaintext password submitted by user
 * @param {string} hashedPassword - Hashed password from database record
 * @returns {Promise<boolean>}
 */
export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export default {
  hashPassword,
  comparePassword,
};
