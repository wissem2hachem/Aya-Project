const Notification = require('../models/Notification');
const User = require('../models/User');

class NotificationService {
  // Create a notification for admin
  static async createAdminNotification(type, message, data) {
    try {
      // Find all admin users
      const admins = await User.find({ role: 'admin' });
      
      // Create notifications for each admin
      const notifications = admins.map(admin => ({
        userId: admin._id,
        type,
        message,
        data,
        read: false
      }));

      // Save notifications to database
      await Notification.insertMany(notifications);

      // Emit real-time notification (if using WebSocket)
      // This part would be implemented if you're using WebSocket for real-time updates
      // socket.emit('new-notification', notifications);

      return notifications;
    } catch (error) {
      console.error('Error creating admin notification:', error);
      throw error;
    }
  }

  // Create notification for leave request
  static async createLeaveRequestNotification(leaveRequest) {
    const message = `New leave request from ${leaveRequest.employeeName}`;
    const data = {
      leaveRequestId: leaveRequest._id,
      employeeId: leaveRequest.employeeId,
      startDate: leaveRequest.startDate,
      endDate: leaveRequest.endDate,
      type: leaveRequest.type
    };

    return this.createAdminNotification('leave_request', message, data);
  }

  // Create notification for job application
  static async createJobApplicationNotification(application) {
    const message = `New job application for ${application.jobTitle}`;
    const data = {
      applicationId: application._id,
      candidateName: application.candidateName,
      jobId: application.jobId,
      jobTitle: application.jobTitle
    };

    return this.createAdminNotification('job_application', message, data);
  }

  // Get notifications for a user
  static async getUserNotifications(userId) {
    try {
      return await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .limit(50);
    } catch (error) {
      console.error('Error fetching user notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  static async markAsRead(notificationId, userId) {
    try {
      return await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { read: true },
        { new: true }
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read for a user
  static async markAllAsRead(userId) {
    try {
      return await Notification.updateMany(
        { userId, read: false },
        { read: true }
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }
}

module.exports = NotificationService; 