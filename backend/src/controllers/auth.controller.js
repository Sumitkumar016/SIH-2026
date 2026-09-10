import { prisma } from "../config/db.js";
import { generateAccessToken } from "../utils/jwt.js";

/**
 * POST /api/auth/login
 * Role-based authentication using pre-seeded credentials.
 * Plaintext comparison (hackathon prototype - no hashing).
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const cleanEmail = String(email).trim().toLowerCase();

    // Query pre-seeded users table
    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // Plaintext password comparison
    if (!user || user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT access token with user details and role
    const token = generateAccessToken(user);

    // Return safe user payload (password omitted under all circumstances)
    const safeUser = {
      user_id: user.user_id,
      name: user.name,
      role: user.role,
      mp_id: user.mp_id,
      district_id: user.district_id,
      state_id: user.state_id,
    };

    return res.status(200).json({
      success: true,
      token,
      user: safeUser,
    });
  } catch (error) {
    console.error("Login controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication.",
    });
  }
};

/**
 * GET /api/auth/me
 * Protected endpoint returning current user details from authenticated JWT session.
 */
export const getMe = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const user = await prisma.user.findUnique({
      where: { user_id: userId },
      select: {
        user_id: true,
        name: true,
        role: true,
        mp_id: true,
        district_id: true,
        state_id: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("getMe controller error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error fetching user profile.",
    });
  }
};
