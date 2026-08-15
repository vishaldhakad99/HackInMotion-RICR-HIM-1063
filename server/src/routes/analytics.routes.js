import express from "express";
import {
  getOverview,
  getCategoriesAnalytics,
  getStatusAnalytics,
  getDepartmentsAnalytics,
  getHotspotsAnalytics,
  getResolutionTimeAnalytics,
} from "../controllers/analytics.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication middleware to protect DB analytics aggregations
router.use(protect);

router.get("/overview", getOverview);
router.get("/categories", getCategoriesAnalytics);
router.get("/status", getStatusAnalytics);
router.get("/departments", getDepartmentsAnalytics);
router.get("/hotspots", getHotspotsAnalytics);
router.get("/resolution-time", getResolutionTimeAnalytics);

export default router;
