import Department from "../models/department.model.js";
import Issue from "../models/issue.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

// @desc    Get all departments
// @route   GET /api/departments
// @access  Public
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ active: true }).sort({ name: 1 });
    
    // Attach issue counts to departments
    const departmentsWithStats = await Promise.all(
      departments.map(async (dept) => {
        const totalIssues = await Issue.countDocuments({ department: dept._id });
        const openIssues = await Issue.countDocuments({
          department: dept._id,
          status: { $in: ["Reported", "In Progress", "Reopened"] },
        });
        const resolvedIssues = await Issue.countDocuments({
          department: dept._id,
          status: { $in: ["Resolved", "Closed"] },
        });

        return {
          ...dept.toObject(),
          stats: {
            totalIssues,
            openIssues,
            resolvedIssues,
          },
        };
      })
    );

    return successResponse(res, 200, "Departments fetched successfully", departmentsWithStats);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get department by ID
// @route   GET /api/departments/:id
// @access  Public
export const getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    if (!department) {
      return errorResponse(res, 404, "Department not found");
    }

    const totalIssues = await Issue.countDocuments({ department: department._id });
    const openIssues = await Issue.countDocuments({
      department: department._id,
      status: { $in: ["Reported", "In Progress", "Reopened"] },
    });
    const resolvedIssues = await Issue.countDocuments({
      department: department._id,
      status: { $in: ["Resolved", "Closed"] },
    });

    return successResponse(res, 200, "Department details fetched", {
      ...department.toObject(),
      stats: {
        totalIssues,
        openIssues,
        resolvedIssues,
      },
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Get issues for a department
// @route   GET /api/departments/:id/issues
// @access  Public
export const getDepartmentIssues = async (req, res) => {
  try {
    const departmentId = req.params.id;
    const { status, priority, page = 1, limit = 10 } = req.query;

    const department = await Department.findById(departmentId);
    if (!department) {
      return errorResponse(res, 404, "Department not found");
    }

    const filter = { department: departmentId };
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Issue.countDocuments(filter);

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name email avatar")
      .populate("department", "name code")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    return successResponse(res, 200, "Department issues retrieved", {
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