import { Router } from "express";
import { login, getMe } from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";
import { protect, restrictTo } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * POST /api/auth/login
 * Public endpoint: Validates request body against loginSchema and checks user credentials.
 */
router.post("/login", validate(loginSchema), login);

/**
 * GET /api/auth/me
 * Protected endpoint: Returns current user profile based on the verified JWT token in req.user.
 */
router.get("/me", protect, getMe);

/**
 * GET /api/auth/role-test/ministry-only
 * Test route: Confirms role restriction works as expected for the "ministry" role.
 */
router.get("/role-test/ministry-only", protect, restrictTo("ministry"), (req, res) => {
  res.status(200).json({ success: true, message: "Authorized Ministry Access" });
});

export default router;
