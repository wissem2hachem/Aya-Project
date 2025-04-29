const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const LeaveRequest = require('../models/LeaveRequest');
const NotificationService = require('../services/notificationService');

// Create a new leave request
router.post('/', auth, async (req, res) => {
  try {
    const leaveRequest = new LeaveRequest({
      ...req.body,
      employeeId: req.user.id,
      employeeName: req.user.name
    });

    await leaveRequest.save();

    // Create notification for admin
    await NotificationService.createLeaveRequestNotification(leaveRequest);

    res.status(201).json(leaveRequest);
  } catch (error) {
    console.error('Error creating leave request:', error);
    res.status(500).json({ message: 'Error creating leave request' });
  }
});

// Get all leave requests (admin only)
router.get('/', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const leaveRequests = await LeaveRequest.find()
      .populate('employeeId', 'name email')
      .sort({ createdAt: -1 });

    res.json(leaveRequests);
  } catch (error) {
    console.error('Error fetching leave requests:', error);
    res.status(500).json({ message: 'Error fetching leave requests' });
  }
});

// Get leave requests for current user
router.get('/my-requests', auth, async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ employeeId: req.user.id })
      .sort({ createdAt: -1 });

    res.json(leaveRequests);
  } catch (error) {
    console.error('Error fetching user leave requests:', error);
    res.status(500).json({ message: 'Error fetching user leave requests' });
  }
});

// Update leave request status (admin only)
router.put('/:id/status', auth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const { status } = req.body;
    const leaveRequest = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Create notification for employee about status update
    await NotificationService.createAdminNotification(
      'leave_request_update',
      `Your leave request has been ${status}`,
      {
        leaveRequestId: leaveRequest._id,
        status,
        startDate: leaveRequest.startDate,
        endDate: leaveRequest.endDate
      }
    );

    res.json(leaveRequest);
  } catch (error) {
    console.error('Error updating leave request status:', error);
    res.status(500).json({ message: 'Error updating leave request status' });
  }
});

module.exports = router; 