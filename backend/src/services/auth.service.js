import User from "../models/user.model.js";
import { generateAccessToken } from "../utils/jwt.js";
import { comparePassword, hashPassword } from "../utils/password.js";

const normalizeEmail = (email) => email.trim().toLowerCase();

const createServiceError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getSafeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  isVerified: user.isVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

// Services contain business logic only.
// Controllers will later read req.body, call these functions, and send res.json().
export const signup = async ({ name, email, password }) => {
  const normalizedEmail = normalizeEmail(email);

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw createServiceError("Email is already registered.", 409);
  }

  const hashedPassword = await hashPassword(password);

  // Public signup always creates a normal user. Admins should be created separately.
  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    role: "user",
  });

  return {
    user: getSafeUser(user),
  };
};

export const login = async ({ email, password }) => {
  const normalizedEmail = normalizeEmail(email);

  // Password is select:false in the model, so it must be selected for login only.
  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    throw createServiceError("Invalid email or password.", 401);
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw createServiceError("Invalid email or password.", 401);
  }

  const token = generateAccessToken(user);

  return {
    user: getSafeUser(user),
    token,
  };
};

export const logout = async () => {
  // With simple JWT auth, logout is handled client-side by removing the token.
  // If cookies are used later, the controller can clear the cookie in the response.
  return {
    message: "Logout successful.",
  };
};
