import express from "express";
import {
  getOverview,
  getCategoriesAnalytics,
  getStatusAnalytics,
  getDepartmentsAnalytics,
  getHotspotsAnalytics,
  getResolutionTimeAnalytics,
} from "../controllers/analytics.controller.js";
import { protect, optionalAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// System overview - accessible with optional authentication (public/authorized)
router.get("/overview", optionalAuth, getOverview);

// Protected database analytics aggregations
router.get("/categories", protect, getCategoriesAnalytics);
router.get("/status", protect, getStatusAnalytics);
router.get("/departments", protect, getDepartmentsAnalytics);
router.get("/hotspots", protect, getHotspotsAnalytics);
router.get("/resolution-time", protect, getResolutionTimeAnalytics);

export default router;

