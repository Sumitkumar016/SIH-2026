import { Router } from "express";
import { login, logout, signup } from "../controllers/auth.controller.js";
import validate from "../middleware/validate.middleware.js";
import { loginSchema, signupSchema } from "../validators/auth.validator.js";

const router = Router();

// Routes stay thin: validate the request, then pass control to the controller.
router.post("/signup", validate(signupSchema), signup);
router.post("/login", validate(loginSchema), login);

// Logout does not need body validation in the current simple JWT setup.
router.post("/logout", logout);

export default router;
