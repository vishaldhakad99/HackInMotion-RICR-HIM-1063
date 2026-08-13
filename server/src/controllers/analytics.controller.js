import Issue from "../models/issue.model.js";
import Department from "../models/department.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

// @desc    Get overall system analytics overview
// @route   GET /api/analytics/overview
// @access  Public
export const getOverview = async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const resolvedIssues = await Issue.countDocuments({
      status: { $in: ["Resolved", "Closed"] },
    });
    const openIssues = await Issue.countDocuments({
      status: { $in: ["Reported", "In Progress", "Reopened"] },
    });

    const resolutionRate = totalIssues > 0 ? ((resolvedIssues / totalIssues) * 100).toFixed(1) : 0;

    // Upvote total count
    const issuesWithUpvotes = await Issue.find().select("upvoteCount");
    const totalUpvotes = issuesWithUpvotes.reduce((acc, curr) => acc + (curr.upvoteCount || 0), 0);

    // Calculate average resolution time for resolved issues
    const resolvedDocs = await Issue.find({
      status: { $in: ["Resolved", "Closed"] },
      "resolution.resolvedAt": { $ne: null },
    }).select("createdAt resolution.resolvedAt");

    let totalResolutionTimeHours = 0;
    resolvedDocs.forEach((doc) => {
      if (doc.resolution?.resolvedAt && doc.createdAt) {
        const diffMs = new Date(doc.resolution.resolvedAt) - new Date(doc.createdAt);
        totalResolutionTimeHours += diffMs / (1000 * 60 * 60);
      }
    });

    const avgResolutionTimeHours =
      resolvedDocs.length > 0 ? (totalResolutionTimeHours / resolvedDocs.length).toFixed(1) : 0;
    const avgResolutionTimeDays = (avgResolutionTimeHours / 24).toFixed(1);

    return successResponse(res, 200, "Analytics overview fetched", {
      totalIssues,
      openIssues,
      resolvedIssues,
      resolutionRate: parseFloat(resolutionRate),
      totalUpvotes,
      avgResolutionTimeHours: parseFloat(avgResolutionTimeHours),
      avgResolutionTimeDays: parseFloat(avgResolutionTimeDays),
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get category analytics breakdown
// @route   GET /api/analytics/categories
// @access  Public
export const getCategoriesAnalytics = async (req, res) => {
  try {
    const categoryStats = await Issue.aggregate([
      {
        $group: {
          _id: "$category",
          totalIssues: { $sum: 1 },
          resolvedIssues: {
            $sum: {
              $cond: [{ $in: ["$status", ["Resolved", "Closed"]] }, 1, 0],
            },
          },
          openIssues: {
            $sum: {
              $cond: [{ $in: ["$status", ["Reported", "In Progress", "Reopened"]] }, 1, 0],
            },
          },
          totalUpvotes: { $sum: "$upvoteCount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          totalIssues: 1,
          resolvedIssues: 1,
          openIssues: 1,
          totalUpvotes: 1,
          resolutionRate: {
            $cond: [
              { $gt: ["$totalIssues", 0] },
              { $multiply: [{ $divide: ["$resolvedIssues", "$totalIssues"] }, 100] },
              0,
            ],
          },
        },
      },
      { $sort: { totalIssues: -1 } },
    ]);

    return successResponse(res, 200, "Categories analytics fetched", categoryStats);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get issue status distribution
// @route   GET /api/analytics/status
// @access  Public
export const getStatusAnalytics = async (req, res) => {
  try {
    const statusStats = await Issue.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
    ]);

    const total = await Issue.countDocuments();
    const formattedStats = statusStats.map((item) => ({
      ...item,
      percentage: total > 0 ? parseFloat(((item.count / total) * 100).toFixed(1)) : 0,
    }));

    return successResponse(res, 200, "Status analytics fetched", {
      total,
      breakdown: formattedStats,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get departmental performance analytics
// @route   GET /api/analytics/departments
// @access  Public
export const getDepartmentsAnalytics = async (req, res) => {
  try {
    const departments = await Department.find();

    const departmentStats = await Promise.all(
      departments.map(async (dept) => {
        const total = await Issue.countDocuments({ department: dept._id });
        const resolved = await Issue.countDocuments({
          department: dept._id,
          status: { $in: ["Resolved", "Closed"] },
        });
        const open = await Issue.countDocuments({
          department: dept._id,
          status: { $in: ["Reported", "In Progress", "Reopened"] },
        });

        const rate = total > 0 ? parseFloat(((resolved / total) * 100).toFixed(1)) : 0;

        return {
          departmentId: dept._id,
          name: dept.name,
          code: dept.code,
          icon: dept.icon,
          totalIssues: total,
          resolvedIssues: resolved,
          openIssues: open,
          resolutionRate: rate,
        };
      })
    );

    return successResponse(res, 200, "Departmental analytics fetched", departmentStats);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get hotspot geographical issue clusters
// @route   GET /api/analytics/hotspots
// @access  Public
export const getHotspotsAnalytics = async (req, res) => {
  try {
    const hotspots = await Issue.aggregate([
      {
        $match: {
          $or: [
            { "location.city": { $exists: true, $ne: "" } },
            { "location.address": { $exists: true, $ne: "" } },
          ],
        },
      },
      {
        $group: {
          _id: {
            city: "$location.city",
            address: "$location.address",
          },
          issueCount: { $sum: 1 },
          criticalCount: {
            $sum: { $cond: [{ $eq: ["$priority", "Critical"] }, 1, 0] },
          },
          latitude: { $first: "$location.latitude" },
          longitude: { $first: "$location.longitude" },
          categories: { $addToSet: "$category" },
        },
      },
      {
        $project: {
          _id: 0,
          city: "$_id.city",
          address: "$_id.address",
          issueCount: 1,
          criticalCount: 1,
          latitude: 1,
          longitude: 1,
          categories: 1,
        },
      },
      { $sort: { issueCount: -1 } },
      { $limit: 20 },
    ]);

    return successResponse(res, 200, "Hotspots analytics fetched", hotspots);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get average resolution time trends
// @route   GET /api/analytics/resolution-time
// @access  Public
export const getResolutionTimeAnalytics = async (req, res) => {
  try {
    const categoryResolutionTimes = await Issue.aggregate([
      {
        $match: {
          status: { $in: ["Resolved", "Closed"] },
          "resolution.resolvedAt": { $ne: null },
        },
      },
      {
        $project: {
          category: 1,
          durationHours: {
            $divide: [
              { $subtract: ["$resolution.resolvedAt", "$createdAt"] },
              1000 * 60 * 60,
            ],
          },
        },
      },
      {
        $group: {
          _id: "$category",
          avgHours: { $avg: "$durationHours" },
          resolvedCount: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          resolvedCount: 1,
          avgHours: { $round: ["$avgHours", 1] },
          avgDays: { $round: [{ $divide: ["$avgHours", 24] }, 1] },
        },
      },
      { $sort: { avgHours: 1 } },
    ]);

    return successResponse(res, 200, "Resolution time analytics fetched", categoryResolutionTimes);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
