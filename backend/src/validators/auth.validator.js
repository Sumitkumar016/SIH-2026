import { z } from "zod";

/**
 * validators/auth.validator.js
 * 
 * Schema for validating user login requests.
 * - Trims and lowercases email for consistency.
 * - Enforces standard email format and required password.
 */
export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .trim()
    .min(1, { message: "Email is required." })
    .email({ message: "Please enter a valid email address." })
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required." })
    .min(1, { message: "Password is required." }),
});

export default {
  loginSchema,
};
