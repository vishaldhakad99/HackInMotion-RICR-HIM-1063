import User from "../models/user.model.js";
import { generateToken } from "../utils/token.js";
import { successResponse, errorResponse } from "../utils/response.js";
import crypto from "crypto";

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

// @desc    Update current user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 404, "User not found");
    }

    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;
    if (req.body.password) user.password = req.body.password;

    const updatedUser = await user.save();

    return successResponse(res, 200, "Profile updated successfully", {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
      department: updatedUser.department,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Forgot Password - generate reset token
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return errorResponse(res, 400, "Please provide an email address");
    }

    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse(res, 404, "No account found with this email address");
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    return successResponse(res, 200, "Password reset instructions sent.", {
      resetToken,
      email: user.email,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Reset Password using token
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
export const resetPassword = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    if (!password) {
      return errorResponse(res, 400, "Please provide a new password");
    }

    if (password.length < 6) {
      return errorResponse(res, 400, "Password must be at least 6 characters long");
    }

    // Hash token to compare with DB
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return errorResponse(res, 400, "Invalid or expired password reset token");
    }

    // Set new password
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return successResponse(res, 200, "Password reset successful. Please login with your new password.");
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};


