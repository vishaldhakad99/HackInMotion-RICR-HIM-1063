import Issue from "../models/issue.model.js";
import Department from "../models/department.model.js";
import Notification from "../models/notification.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

// Helper to safely escape user input for Regular Expression queries
const escapeRegex = (str) => {
  if (typeof str !== "string") return "";
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Helper function to auto-assign department by category
const findDepartmentForCategory = async (category) => {
  if (!category) return null;
  const safeCategory = escapeRegex(category);
  const dept = await Department.findOne({
    $or: [
      { name: new RegExp(safeCategory, "i") },
      { code: new RegExp(safeCategory, "i") },
    ],
  });
  return dept ? dept._id : null;
};

// @desc    Create a new issue
// @route   POST /api/issues
// @access  Private
export const createIssue = async (req, res) => {
  try {
    const { title, description, category, location, images, priority, department } = req.body;

    if (!title || !description || !category) {
      return errorResponse(res, 400, "Please provide title, description, and category");
    }

    let assignedDepartment = department;
    if (!assignedDepartment) {
      assignedDepartment = await findDepartmentForCategory(category);
    }

    const issue = await Issue.create({
      title,
      description,
      category,
      department: assignedDepartment,
      location: location || {},
      images: images || [],
      priority: priority || "Medium",
      reportedBy: req.user._id,
    });

    const populatedIssue = await Issue.findById(issue._id)
      .populate("reportedBy", "name email avatar")
      .populate("department", "name code");

    return successResponse(res, 201, "Issue reported successfully", populatedIssue);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get all issues (with filtering, search, sorting, pagination)
// @route   GET /api/issues
// @access  Public
export const getIssues = async (req, res) => {
  try {
    const { status, category, department, search, sortBy, page = 1, limit = 10 } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (category) filter.category = new RegExp(escapeRegex(category), "i");
    if (department) filter.department = department;
    if (search) {
      const safeSearch = escapeRegex(search);
      filter.$or = [
        { title: new RegExp(safeSearch, "i") },
        { description: new RegExp(safeSearch, "i") },
        { "location.address": new RegExp(safeSearch, "i") },
        { "location.city": new RegExp(safeSearch, "i") },
      ];
    }

    let sort = { createdAt: -1 };
    if (sortBy === "upvotes") {
      sort = { upvoteCount: -1, createdAt: -1 };
    } else if (sortBy === "oldest") {
      sort = { createdAt: 1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Issue.countDocuments(filter);

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name email avatar")
      .populate("department", "name code")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    return successResponse(res, 200, "Issues fetched successfully", {
      issues,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get issues reported by currently logged in user
// @route   GET /api/issues/my
// @access  Private
export const getMyIssues = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const filter = { reportedBy: req.user._id };
    if (status) filter.status = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Issue.countDocuments(filter);

    const issues = await Issue.find(filter)
      .populate("department", "name code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return successResponse(res, 200, "User issues retrieved successfully", {
      issues,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit),
      },
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get issue detail by ID
// @route   GET /api/issues/:id
// @access  Public
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name email avatar")
      .populate("department", "name code headName contactEmail")
      .populate("upvotes", "name email")
      .populate("verifications.user", "name email avatar")
      .populate("verifyPhotos.user", "name email avatar")
      .populate("reopenHistory.reopenedBy", "name email")
      .populate("resolution.resolvedBy", "name email");

    if (!issue) {
      return errorResponse(res, 404, "Issue not found");
    }

    return successResponse(res, 200, "Issue details retrieved", issue);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Update issue by ID
// @route   PUT /api/issues/:id
// @access  Private
export const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return errorResponse(res, 404, "Issue not found");
    }

    // Check ownership or admin
    if (issue.reportedBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return errorResponse(res, 403, "Not authorized to update this issue");
    }

    const { title, description, category, location, images, priority, department } = req.body;

    if (title) issue.title = title;
    if (description) issue.description = description;
    if (category) issue.category = category;
    if (location) issue.location = { ...issue.location, ...location };
    if (images) issue.images = images;
    if (priority) issue.priority = priority;
    // Only administrators are allowed to change/reassign the department of an issue
    if (department && req.user.role === "admin") {
      issue.department = department;
    }

    await issue.save();

    const updatedIssue = await Issue.findById(issue._id)
      .populate("reportedBy", "name email avatar")
      .populate("department", "name code");

    return successResponse(res, 200, "Issue updated successfully", updatedIssue);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Upvote/Unvote an issue
// @route   POST /api/issues/:id/upvote
// @access  Private
export const upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return errorResponse(res, 404, "Issue not found");
    }

    const userId = req.user._id;
    const upvoteIndex = issue.upvotes.indexOf(userId);

    let message = "";
    if (upvoteIndex > -1) {
      // Remove upvote
      issue.upvotes.splice(upvoteIndex, 1);
      message = "Upvote removed";
    } else {
      // Add upvote
      issue.upvotes.push(userId);
      message = "Issue upvoted successfully";

      // Create notification for issue reporter if upvoted by someone else
      if (issue.reportedBy.toString() !== userId.toString()) {
        await Notification.create({
          user: issue.reportedBy,
          title: "New Upvote on Your Issue",
          message: `${req.user.name} upvoted your issue "${issue.title}".`,
          type: "UPVOTE",
          issue: issue._id,
        });
      }
    }

    issue.upvoteCount = issue.upvotes.length;
    await issue.save();

    return successResponse(res, 200, message, {
      upvoteCount: issue.upvoteCount,
      hasUpvoted: upvoteIndex === -1,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Verify an issue (Community Verification)
// @route   POST /api/issues/:id/verify
// @access  Private
export const verifyIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return errorResponse(res, 404, "Issue not found");
    }

    const { status = "verified", comment = "", photoUrl = "" } = req.body;
    const userId = req.user._id;

    // Check if user already verified
    const existingIndex = issue.verifications.findIndex(
      (v) => v.user.toString() === userId.toString()
    );

    if (existingIndex > -1) {
      issue.verifications[existingIndex].status = status;
      issue.verifications[existingIndex].comment = comment;
      if (photoUrl) issue.verifications[existingIndex].photoUrl = photoUrl;
    } else {
      issue.verifications.push({
        user: userId,
        status,
        comment,
        photoUrl,
        createdAt: new Date(),
      });
    }

    issue.verificationCount = issue.verifications.filter((v) => v.status === "verified").length;
    await issue.save();

    return successResponse(res, 200, "Verification submitted successfully", {
      verificationCount: issue.verificationCount,
      verifications: issue.verifications,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Reopen a resolved issue
// @route   POST /api/issues/:id/reopen
// @access  Private
export const reopenIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return errorResponse(res, 404, "Issue not found");
    }

    const { reason } = req.body;
    if (!reason) {
      return errorResponse(res, 400, "Please provide a reason for reopening the issue");
    }

    issue.status = "Reopened";
    issue.reopenHistory.push({
      reopenedBy: req.user._id,
      reason,
      reopenedAt: new Date(),
    });

    await issue.save();

    // Create notification if reporter reopened or admin reopened
    await Notification.create({
      user: issue.reportedBy,
      title: "Issue Reopened",
      message: `Issue "${issue.title}" has been reopened. Reason: ${reason}`,
      type: "STATUS_CHANGE",
      issue: issue._id,
    });

    const updatedIssue = await Issue.findById(issue._id)
      .populate("reportedBy", "name email avatar")
      .populate("department", "name code");

    return successResponse(res, 200, "Issue reopened successfully", updatedIssue);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Upload community verification photo for issue
// @route   POST /api/issues/:id/verify-photo
// @access  Private
export const verifyPhotoIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return errorResponse(res, 404, "Issue not found");
    }

    const { photoUrl, comment } = req.body;
    if (!photoUrl) {
      return errorResponse(res, 400, "Please provide a photoUrl");
    }

    issue.verifyPhotos.push({
      user: req.user._id,
      photoUrl,
      comment: comment || "",
      createdAt: new Date(),
    });

    await issue.save();

    return successResponse(res, 200, "Verification photo added successfully", {
      verifyPhotos: issue.verifyPhotos,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
