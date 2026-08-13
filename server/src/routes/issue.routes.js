import express from "express";
import {
  createIssue,
  getIssues,
  getMyIssues,
  getIssueById,
  updateIssue,
  upvoteIssue,
  verifyIssue,
  reopenIssue,
  verifyPhotoIssue,
} from "../controllers/issue.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.route("/").post(protect, createIssue).get(getIssues);
router.get("/my", protect, getMyIssues);
router.route("/:id").get(getIssueById).put(protect, updateIssue);

router.post("/:id/upvote", protect, upvoteIssue);
router.post("/:id/verify", protect, verifyIssue);
router.post("/:id/reopen", protect, reopenIssue);
router.post("/:id/verify-photo", protect, verifyPhotoIssue);

export default router;
