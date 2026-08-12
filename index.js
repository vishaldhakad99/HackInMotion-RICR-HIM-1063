import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./src/config/dbConnection.js";
import userRoutes from "./src/routes/user.routes.js";
import errorMiddleware from "./src/middleware/error.middleware.js";

dotenv.config();

const app = express();

// Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);

// Home route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HackInMotion Backend Server is Running 🚀",
  });
});

// Error middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 4500;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});