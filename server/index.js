import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import connectDB from "./src/config/dbConnection.js";
import authRoutes from "./src/routes/auth.routes.js";
import issueRoutes from "./src/routes/issue.routes.js";
import adminRoutes from "./src/routes/admin.routes.js";
import departmentRoutes from "./src/routes/department.routes.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";
import uploadRoutes from "./src/routes/upload.routes.js";
import errorMiddleware from "./src/middleware/error.middleware.js";

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// API Routes
app.use("/api/auth", authRoutes);
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
    message: "HackInMotion Civic Issue Management API is Running 🚀",
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