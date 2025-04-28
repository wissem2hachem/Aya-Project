const express = require('express');
const router = express.Router();
const Attendance = require('../models/Attendance');
const { authenticate } = require('../middleware/authMiddleware');

// Mark attendance for an employee
router.post('/', authenticate, async (req, res) => {
  try {
    // Check if user has permission to mark attendance
    if (!['admin', 'hr', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized to mark attendance' });
    }

    const { employeeId, date, status, checkIn, checkOut, notes } = req.body;

    // Check if attendance already exists for this employee on this date
    const existingAttendance = await Attendance.findOne({
      employeeId,
      date: new Date(date)
    });

    if (existingAttendance) {
      return res.status(400).json({ message: 'Attendance already marked for this date' });
    }

    const attendance = new Attendance({
      employeeId,
      date: new Date(date),
      status,
      checkIn: checkIn ? new Date(checkIn) : undefined,
      checkOut: checkOut ? new Date(checkOut) : undefined,
      markedBy: req.user._id,
      notes
    });

    await attendance.save();

    // Populate employee and markedBy fields
    const populatedAttendance = await Attendance.findById(attendance._id)
      .populate('employeeId', 'name email')
      .populate('markedBy', 'name email');

    res.status(201).json(populatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get attendance records for a specific employee
router.get('/employee/:employeeId', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { employeeId: req.params.employeeId };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const attendance = await Attendance.find(query)
      .populate('employeeId', 'name email')
      .populate('markedBy', 'name email')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get attendance records for all employees (admin/HR only)
router.get('/', authenticate, async (req, res) => {
  try {
    // Check if user has permission to view all attendance records
    if (!['admin', 'hr', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized to view all attendance records' });
    }

    const { startDate, endDate, status } = req.query;
    const query = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (status) {
      query.status = status;
    }

    const attendance = await Attendance.find(query)
      .populate('employeeId', 'name email')
      .populate('markedBy', 'name email')
      .sort({ date: -1 });

    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update attendance record
router.patch('/:id', authenticate, async (req, res) => {
  try {
    // Check if user has permission to update attendance
    if (!['admin', 'hr', 'manager'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized to update attendance' });
    }

    const { status, checkIn, checkOut, notes } = req.body;
    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    if (status) attendance.status = status;
    if (checkIn) attendance.checkIn = new Date(checkIn);
    if (checkOut) attendance.checkOut = new Date(checkOut);
    if (notes) attendance.notes = notes;

    await attendance.save();

    const updatedAttendance = await Attendance.findById(attendance._id)
      .populate('employeeId', 'name email')
      .populate('markedBy', 'name email');

    res.json(updatedAttendance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete attendance record
router.delete('/:id', authenticate, async (req, res) => {
  try {
    // Check if user has permission to delete attendance
    if (!['admin', 'hr'].includes(req.user.role)) {
      return res.status(403).json({ message: 'Unauthorized to delete attendance records' });
    }

    const attendance = await Attendance.findById(req.params.id);

    if (!attendance) {
      return res.status(404).json({ message: 'Attendance record not found' });
    }

    await attendance.deleteOne();
    res.json({ message: 'Attendance record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 