import Notification from "../models/notification.model.js";
import { successResponse, errorResponse } from "../utils/response.js";

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .populate("issue", "title status category")
      .sort({ createdAt: -1 });

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      isRead: false,
    });

    return successResponse(res, 200, "Notifications fetched successfully", {
      notifications,
      unreadCount,
    });
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!notification) {
      return errorResponse(res, 404, "Notification not found");
    }

    notification.isRead = true;
    await notification.save();

    return successResponse(res, 200, "Notification marked as read", notification);
  } catch (error) {
    return errorResponse(res, 500, error.message);
  }
};
