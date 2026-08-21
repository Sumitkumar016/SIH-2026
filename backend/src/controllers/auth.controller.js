import {
  login as loginUser,
  logout as logoutUser,
  signup as signupUser,
} from "../services/auth.service.js";

const sendErrorResponse = (res, error) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Something went wrong.",
  });
};

// Controllers handle HTTP-specific work: req.body, status codes, and JSON responses.
// Business rules like hashing, database queries, and token generation stay in services.
export const signup = async (req, res) => {
  try {
    const result = await signupUser(req.body);

    res.status(201).json({
      success: true,
      message: "Signup successful.",
      data: result,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const login = async (req, res) => {
  try {
    const result = await loginUser(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};

export const logout = async (req, res) => {
  try {
    const result = await logoutUser();

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    sendErrorResponse(res, error);
  }
};
