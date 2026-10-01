import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { errorResponse } from "../utils/response.js";

/**
 * Extract token from Authorization header, custom headers, cookies, or query
 */
export const extractToken = (req) => {
  let token = null;

  // 1. Authorization header (Bearer <token> or raw token)
  if (req.headers.authorization) {
    const authHeader = req.headers.authorization.trim();
    if (authHeader.toLowerCase().startsWith("bearer ")) {
      token = authHeader.substring(7).trim();
    } else if (!authHeader.includes(" ")) {
      token = authHeader;
    }
  }

  // 2. Custom headers (x-auth-token or x-access-token)
  if (!token && req.headers["x-auth-token"]) {
    token = req.headers["x-auth-token"];
  }
  if (!token && req.headers["x-access-token"]) {
    token = req.headers["x-access-token"];
  }

  // 3. Cookies parsed on req.cookies (cookie-parser)
  if (!token && req.cookies) {
    token = req.cookies.token || req.cookies.jwt || req.cookies.accessToken;
  }

  // 4. Raw Cookie header fallback (if cookie-parser is not used)
  if (!token && req.headers.cookie) {
    const match = req.headers.cookie.match(/(?:^|;\s*)(?:token|jwt|accessToken)=([^;]+)/);
    if (match) {
      token = decodeURIComponent(match[1]);
    }
  }

  // 5. Query parameter fallback
  if (!token && req.query && req.query.token) {
    token = req.query.token;
  }

  if (token && typeof token === "string") {
    token = token.replace(/^["']|["']$/g, "").trim();
  }

  return token || null;
};

export const protect = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return errorResponse(res, 401, "Not authorized, no token provided");
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key"
    );

    const userId = decoded.id || decoded._id || decoded.userId;
    if (!userId) {
      return errorResponse(res, 401, "Not authorized, invalid token payload");
    }

    req.user = await User.findById(userId).select("-password");

    if (!req.user) {
      return errorResponse(res, 401, "User not found or unauthorized");
    }

    return next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);
    return errorResponse(res, 401, "Not authorized, token failed");
  }
};

export const optionalAuth = async (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_key"
    );
    const userId = decoded.id || decoded._id || decoded.userId;
    if (userId) {
      req.user = await User.findById(userId).select("-password");
    }
  } catch {
    // Proceed without attaching req.user if token is invalid or expired
  }

  return next();
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

