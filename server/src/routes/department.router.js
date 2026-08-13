import express from "express";
import {
  getDepartments,
  getDepartmentById,
  getDepartmentIssues,
} from "../controllers/department.controller.js";

const router = express.Router();

router.get("/", getDepartments);
router.get("/:id", getDepartmentById);
router.get("/:id/issues", getDepartmentIssues);

export default router;