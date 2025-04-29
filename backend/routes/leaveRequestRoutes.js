const express = require('express');
const router = express.Router();
const LeaveRequest = require('../models/LeaveRequest');
const { authenticate, authorizeUser } = require('../middleware/authMiddleware');

// Create a new leave request
router.post('/', authenticate, async (req, res) => {
  try {
    const leaveRequest = new LeaveRequest({
      ...req.body,
      employeeId: req.user._id
    });
    await leaveRequest.save();
    res.status(201).json(leaveRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all leave requests (for HR/Admin)
router.get('/', authenticate, async (req, res) => {
  try {
    const { status, employeeId, limit } = req.query;
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (employeeId) {
      query.employeeId = employeeId;
    }
    
    let leaveRequests = await LeaveRequest.find(query)
      .populate('employeeId', 'name email')
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
      
    // Apply limit if specified
    if (limit) {
      leaveRequests = leaveRequests.slice(0, parseInt(limit));
    }
      
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get leave requests for current user
router.get('/my-requests', authenticate, async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.find({ employeeId: req.user._id })
      .populate('approvedBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(leaveRequests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update leave request status (for HR/Admin)
router.patch('/:id/status', authenticate, async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    
    // Check if user has permission to approve/reject requests
    if (!req.user.role || !['admin', 'hr', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized to update leave request status' });
    }
    
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Update the leave request
    leaveRequest.status = status;
    leaveRequest.approvedBy = req.user._id;
    leaveRequest.approvedDate = new Date();
    
    if (status === 'rejected' && rejectionReason) {
      leaveRequest.rejectionReason = rejectionReason;
    }
    
    await leaveRequest.save();
    
    // Populate the updated request with employee and approver info
    const updatedRequest = await LeaveRequest.findById(leaveRequest._id)
      .populate('employeeId', 'name email')
      .populate('approvedBy', 'name email');
    
    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete leave request
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const leaveRequest = await LeaveRequest.findById(req.params.id);
    
    if (!leaveRequest) {
      return res.status(404).json({ message: 'Leave request not found' });
    }
    
    // Only allow deletion if the request is pending or if the user is the creator
    if (leaveRequest.status !== 'pending' && leaveRequest.employeeId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this request' });
    }
    
    await leaveRequest.remove();
    res.json({ message: 'Leave request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get count of pending leave requests
router.get("/pending/count", authenticate, async (req, res) => {
  try {
    const count = await LeaveRequest.countDocuments({ status: 'pending' });
    res.status(200).json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 