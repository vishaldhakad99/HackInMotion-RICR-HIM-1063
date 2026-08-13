import express from "express";
import {
  getDashboard,
  getAdminIssues,
  getAdminIssueById,
  updateIssueStatus,
  submitResolution,
} from "../controllers/admin.controller.js";
import { protect, adminOnly } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply protect & adminOnly to all admin routes
router.use(protect, adminOnly);

router.get("/dashboard", getDashboard);
router.get("/issues", getAdminIssues);
router.get("/issues/:id", getAdminIssueById);
router.put("/issues/:id/status", updateIssueStatus);
router.post("/issues/:id/resolution", submitResolution);

export default router;
