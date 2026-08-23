import User from "../models/user.model.js";
import { generateToken } from "../utils/token.js";
import { successResponse, errorResponse } from "../utils/response.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
      role: "user", // Public registration is strictly scoped to 'user' role
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

// @desc    Forgot Password - generate reset token & send email
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

    // Get reset token (unhashed token for email link, hashed token saved to DB)
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL (FRONTEND_URL/reset-password/<token>)
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const resetUrl = `${frontendUrl}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) requested a password reset for your CivicConnect account.\n\nPlease click on the following link or paste it into your browser to complete the process:\n\n${resetUrl}\n\nThis link will expire in 30 minutes.\n\nIf you did not request this, please ignore this email and your password will remain unchanged.`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h2 style="color: #0284c7; margin: 0; font-size: 24px;">CivicConnect</h2>
          <p style="color: #64748b; font-size: 11px; font-weight: bold; letter-spacing: 1px; margin-top: 4px;">SMART CITY PLATFORM</p>
        </div>
        <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 24px; border: 1px solid #f1f5f9;">
          <h3 style="color: #0f172a; margin-top: 0; font-size: 16px;">Password Reset Request</h3>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            We received a request to reset the password for your CivicConnect account associated with <strong>${user.email}</strong>.
          </p>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            Click the button below to reset your password. This link is valid for <strong>30 minutes</strong>.
          </p>
          <div style="text-align: center; margin: 28px 0;">
            <a href="${resetUrl}" style="background-color: #0284c7; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #64748b; font-size: 12px; line-height: 1.5;">
            If the button doesn't work, copy and paste the following link into your browser:<br/>
            <a href="${resetUrl}" style="color: #0284c7; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">
          If you did not request a password reset, please ignore this email and your password will remain unchanged.
        </p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: "CivicConnect - Password Reset Request",
        message,
        html,
      });

      return successResponse(
        res,
        200,
        "Password reset link has been sent to your email address."
      );
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return errorResponse(
        res,
        500,
        "Email could not be sent. Please verify your email server configuration."
      );
    }
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


