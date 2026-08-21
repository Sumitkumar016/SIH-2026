import { z } from "zod";

const requiredString = (fieldName) =>
  z
    .string({ error: `${fieldName} is required.` })
    .trim()
    .min(1, { message: `${fieldName} is required.` });

const emailSchema = requiredString("Email")
  .email({ message: "Please enter a valid email address." })
  .toLowerCase();

const passwordSchema = requiredString("Password")
  .min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[A-Za-z]/, {
    message: "Password must contain at least one letter.",
  })
  .regex(/[0-9]/, {
    message: "Password must contain at least one number.",
  });

// Signup validation only checks the request shape and basic input quality.
// It does not query the database, hash passwords, or create users.
export const signupSchema = z.object({
  name: requiredString("Name").min(2, {
    message: "Name must be at least 2 characters long.",
  }),
  email: emailSchema,
  password: passwordSchema,
});

// Login validation stays simple: confirm the credentials are present and usable.
export const loginSchema = z.object({
  email: emailSchema,
  password: requiredString("Password"),
});
