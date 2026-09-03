import { Router } from "express";
import { login, getMe } from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";
import { protect, restrictTo } from "../middleware/auth.js";

const router = Router();

// Public authentication route
router.post("/login", validate(loginSchema), login);

// Protected session restoration route
router.get("/me", protect, getMe);

// Role-protected endpoint for testing restrictTo
router.get("/role-test/ministry-only", protect, restrictTo("ministry"), (req, res) => {
  res.status(200).json({ success: true, message: "Authorized Ministry Access" });
});

export default router;
