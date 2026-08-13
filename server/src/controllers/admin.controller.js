import Issue from "../models/issue.model.js";
import User from "../models/user.model.js";
import Department from "../models/department.model.js";
import Notification from "../models/notification.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

// @desc    Get admin dashboard metrics & summary
// @route   GET /api/admin/dashboard
// @access  Private/Admin
export const getDashboard = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalDepartments = await Department.countDocuments();

    const statusCounts = {
      reported: await Issue.countDocuments({ status: "Reported" }),
      inProgress: await Issue.countDocuments({ status: "In Progress" }),
      resolved: await Issue.countDocuments({ status: "Resolved" }),
      reopened: await Issue.countDocuments({ status: "Reopened" }),
      closed: await Issue.countDocuments({ status: "Closed" }),
      rejected: await Issue.countDocuments({ status: "Rejected" }),
    };

    const priorityCounts = {
      critical: await Issue.countDocuments({ priority: "Critical" }),
      high: await Issue.countDocuments({ priority: "High" }),
      medium: await Issue.countDocuments({ priority: "Medium" }),
      low: await Issue.countDocuments({ priority: "Low" }),
    };

    const recentIssues = await Issue.find()
      .populate("reportedBy", "name email")
      .populate("department", "name code")
      .sort({ createdAt: -1 })
      .limit(5);

    return successResponse(res, 200, "Admin dashboard data fetched", {
      metrics: {
        totalIssues,
        totalUsers,
        totalDepartments,
        statusCounts,
        priorityCounts,
      },
      recentIssues,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get all issues for admin management
// @route   GET /api/admin/issues
// @access  Private/Admin
export const getAdminIssues = async (req, res) => {
  try {
    const { status, priority, department, unassigned, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (department) filter.department = department;
    if (unassigned === "true") filter.department = null;

    if (search) {
      filter.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { "location.address": new RegExp(search, "i") },
        { "location.city": new RegExp(search, "i") },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Issue.countDocuments(filter);

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name email avatar")
      .populate("department", "name code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return successResponse(res, 200, "Admin issues list retrieved", {
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

// @desc    Get detailed single issue for admin
// @route   GET /api/admin/issues/:id
// @access  Private/Admin
export const getAdminIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name email avatar role")
      .populate("department", "name code headName contactEmail")
      .populate("upvotes", "name email")
      .populate("verifications.user", "name email avatar")
      .populate("verifyPhotos.user", "name email avatar")
      .populate("reopenHistory.reopenedBy", "name email")
      .populate("resolution.resolvedBy", "name email");

    if (!issue) {
      return errorResponse(res, 404, "Issue not found");
    }

    return successResponse(res, 200, "Admin issue details retrieved", issue);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Update issue status & department assignment by admin
// @route   PUT /api/admin/issues/:id/status
// @access  Private/Admin
export const updateIssueStatus = async (req, res) => {
  try {
    const { status, department, priority } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return errorResponse(res, 404, "Issue not found");
    }

    const oldStatus = issue.status;
    if (status) issue.status = status;
    if (department) issue.department = department;
    if (priority) issue.priority = priority;

    await issue.save();

    // Create notification for reporter if status changed
    if (status && oldStatus !== status) {
      await Notification.create({
        user: issue.reportedBy,
        title: "Issue Status Updated",
        message: `Your issue "${issue.title}" status changed from '${oldStatus}' to '${status}'.`,
        type: "STATUS_CHANGE",
        issue: issue._id,
      });
    }

    const updatedIssue = await Issue.findById(issue._id)
      .populate("reportedBy", "name email avatar")
      .populate("department", "name code");

    return successResponse(res, 200, "Issue status updated successfully", updatedIssue);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Submit issue resolution details by admin
// @route   POST /api/admin/issues/:id/resolution
// @access  Private/Admin
export const submitResolution = async (req, res) => {
  try {
    const { details, proofPhotos } = req.body;

    if (!details) {
      return errorResponse(res, 400, "Please provide resolution details");
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return errorResponse(res, 404, "Issue not found");
    }

    issue.status = "Resolved";
    issue.resolution = {
      details,
      proofPhotos: proofPhotos || [],
      resolvedBy: req.user._id,
      resolvedAt: new Date(),
    };

    await issue.save();

    // Notify issue reporter
    await Notification.create({
      user: issue.reportedBy,
      title: "Issue Resolved 🎉",
      message: `Your reported issue "${issue.title}" has been marked as Resolved by administration.`,
      type: "RESOLUTION",
      issue: issue._id,
    });

    const updatedIssue = await Issue.findById(issue._id)
      .populate("reportedBy", "name email avatar")
      .populate("department", "name code")
      .populate("resolution.resolvedBy", "name email");

    return successResponse(res, 200, "Resolution submitted successfully", updatedIssue);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
