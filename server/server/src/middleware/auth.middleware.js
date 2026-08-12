import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorResponse } from "../utils/response.js";

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "fallback_secret_key"
      );

      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return errorResponse(res, 401, "User not found or unauthorized");
      }

      return next();
    } catch (error) {
      console.error("Auth middleware error:", error.message);
      return errorResponse(res, 401, "Not authorized, token failed");
    }
  }

  if (!token) {
    return errorResponse(res, 401, "Not authorized, no token provided");
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return errorResponse(res, 403, "Access denied. Admin role required.");
};

export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        403,
        `User role '${req.user?.role}' is not authorized to access this route`
      );
    }
    next();
  };
};
