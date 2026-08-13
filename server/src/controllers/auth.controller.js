import User from "../models/user.model.js";
import { generateToken } from "../utils/token.js";
import { successResponse, errorResponse } from "../utils/response.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return errorResponse(res, 400, "Please provide name, email, and password");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(res, 400, "User already exists with this email");
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "user",
    });

    if (user) {
      const token = generateToken(user._id);
      return successResponse(res, 201, "User registered successfully", {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token,
      });
    } else {
      return errorResponse(res, 400, "Invalid user data");
    }
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse(res, 400, "Please provide email and password");
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);
      return successResponse(res, 200, "Login successful", {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        token,
      });
    } else {
      return errorResponse(res, 401, "Invalid email or password");
    }
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").populate("department", "name code");
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    return successResponse(res, 200, "User profile retrieved successfully", user);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
