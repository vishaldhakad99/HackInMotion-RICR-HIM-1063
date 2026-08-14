import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./src/config/dbConnection.js";
import authRoutes from "./src/routes/auth.routes.js";
import issueRoutes from "./src/routes/issue.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import departmentRoutes from "./src/routes/department.routes.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import errorMiddleware from "./src/middleware/error.middleware.js";
import {
  securityHeaders,
  apiLimiter,
  authLimiter,
  sanitizeInput,
} from "./src/middleware/security.middleware.js";

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Security Middlewares
app.use(securityHeaders);

// Configurable CORS Policy
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Allow requests during development/staging
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Body Parsing & Sanitization
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(sanitizeInput);

// General Rate Limiting
app.use("/api", apiLimiter);

// API Routes with Specific Limiters
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/issues", issueRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/upload", uploadRoutes);

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HackInMotion Smart City Civic Issue API is Secured & Running 🚀",
    security: "Helmet, RateLimiting, NoSQLSanitization, RBAC, JWT Active",
    endpoints: {
      auth: "/api/auth",
      issues: "/api/issues",
      admin: "/api/admin",
      departments: "/api/departments",
      analytics: "/api/analytics",
      notifications: "/api/notifications",
      upload: "/api/upload",
    },
  });
});

// Error handling middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});