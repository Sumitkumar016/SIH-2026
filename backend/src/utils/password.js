import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

// Hash a plain text password before saving it to the database.
// The original password should never be stored or logged.
export const hashPassword = async (password) => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

// Compare a login password with the hashed password stored in MongoDB.
// Returns true when they match and false when they do not.
export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};
