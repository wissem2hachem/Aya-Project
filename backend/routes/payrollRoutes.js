const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');
const User = require('../models/User');
const { authenticate } = require('../middleware/authMiddleware');

// Get all payroll records for a specific month
router.get('/', authenticate, async (req, res) => {
  try {
    const { month } = req.query;
    if (!month) {
      return res.status(400).json({ message: 'Month parameter is required' });
    }

    const startDate = new Date(month);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);

    const payrollRecords = await Payroll.find({
      month: {
        $gte: startDate,
        $lte: endDate
      }
    }).populate('employee', 'name email department position');

    res.json(payrollRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Generate payroll for all active employees
router.post('/generate', authenticate, async (req, res) => {
  try {
    const { month } = req.body;
    if (!month) {
      return res.status(400).json({ message: 'Month is required' });
    }

    // Get all active employees
    const activeEmployees = await User.find({ status: 'active' });
    
    // Generate payroll for each employee
    const payrollPromises = activeEmployees.map(async (employee) => {
      // Check if payroll already exists for this employee and month
      const existingPayroll = await Payroll.findOne({
        employee: employee._id,
        month: new Date(month)
      });

      if (existingPayroll) {
        return existingPayroll;
      }

      // Calculate tax based on salary (simplified calculation)
      const taxRate = 0.2; // 20% tax rate
      const taxDeductions = employee.salary * taxRate;

      // Create new payroll record
      const payroll = new Payroll({
        employee: employee._id,
        month: new Date(month),
        basicSalary: employee.salary,
        taxDeductions,
        insuranceDeductions: 100, // Fixed insurance deduction
        status: 'pending'
      });

      return payroll.save();
    });

    const payrollRecords = await Promise.all(payrollPromises);
    res.status(201).json(payrollRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single payroll record
router.get('/:id', authenticate, async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id)
      .populate('employee', 'name email department position');
    
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }
    
    res.json(payroll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new payroll record
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      employeeId,
      month,
      basicSalary,
      overtimePay,
      bonuses,
      taxDeductions,
      insuranceDeductions,
      otherDeductions,
      netPay,
      paymentMethod,
      accountNumber
    } = req.body;

    const payroll = new Payroll({
      employee: employeeId,
      month,
      basicSalary,
      overtimePay,
      bonuses,
      taxDeductions,
      insuranceDeductions,
      otherDeductions,
      netPay,
      paymentMethod,
      accountNumber
    });

    const newPayroll = await payroll.save();
    res.status(201).json(newPayroll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a payroll record
router.put('/:id', authenticate, async (req, res) => {
  try {
    const {
      basicSalary,
      overtimePay,
      bonuses,
      taxDeductions,
      insuranceDeductions,
      otherDeductions,
      status,
      paymentDate,
      paymentMethod,
      accountNumber
    } = req.body;

    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    // Only allow updating specific fields
    if (basicSalary !== undefined) payroll.basicSalary = basicSalary;
    if (overtimePay !== undefined) payroll.overtimePay = overtimePay;
    if (bonuses !== undefined) payroll.bonuses = bonuses;
    if (taxDeductions !== undefined) payroll.taxDeductions = taxDeductions;
    if (insuranceDeductions !== undefined) payroll.insuranceDeductions = insuranceDeductions;
    if (otherDeductions !== undefined) payroll.otherDeductions = otherDeductions;
    if (status) payroll.status = status;
    if (paymentDate) payroll.paymentDate = paymentDate;
    if (paymentMethod) payroll.paymentMethod = paymentMethod;
    if (accountNumber) payroll.accountNumber = accountNumber;

    const updatedPayroll = await payroll.save();
    res.json(updatedPayroll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a payroll record
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    // Only allow deletion of pending payrolls
    if (payroll.status === 'processed') {
      return res.status(400).json({ message: 'Cannot delete processed payroll records' });
    }

    await payroll.remove();
    res.json({ message: 'Payroll record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 