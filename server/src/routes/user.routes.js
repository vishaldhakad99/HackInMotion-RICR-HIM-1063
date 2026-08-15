import express from "express";
import { getUsers } from "../controllers/user.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getUsers);

export default router;