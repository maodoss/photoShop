// 6. notificationController.js
import Notification from '../models/Notification.js';

// @desc    Create new notification
// @route   POST /api/notifications
// @access  Private (Admin/System)
export const createNotification = async (req, res) => {
  try {
    const notification = await Notification.create(req.body);

    res.status(201).json({
      success: true,
      data: notification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, lue } = req.query;
    
    let query = { destinataire: req.user.id };
    
    if (lue !== undefined) {
      query.lue = lue === 'true';
    }

    const notifications = await Notification.find(query)
      .populate('expediteur', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);

    res.status(200).json({
      success: true,
      count: notifications.length,
      total,
      data: notifications
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markNotificationAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user owns the notification
    if (notification.destinataire.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this notification'
      });
    }

    const updatedNotification = await Notification.findByIdAndUpdate(
      req.params.id,
      { lue: true },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: updatedNotification
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllNotificationsAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { destinataire: req.user.id, lue: false },
      { lue: true }
    );

    res.status(200).json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    // Check if user owns the notification
    if (notification.destinataire.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this notification'
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};