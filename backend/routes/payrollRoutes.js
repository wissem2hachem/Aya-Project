const express = require('express');
const router = express.Router();
const Payroll = require('../models/Payroll');
const User = require('../models/User');
const { authenticate } = require('../middleware/authMiddleware');

// Get all payroll records for a specific month
router.get('/', authenticate, async (req, res) => {
  try {
    const { month } = req.query;
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
      netPay,
      status,
      paymentDate,
      paymentMethod,
      accountNumber
    } = req.body;

    const payroll = await Payroll.findById(req.params.id);
    if (!payroll) {
      return res.status(404).json({ message: 'Payroll record not found' });
    }

    payroll.basicSalary = basicSalary || payroll.basicSalary;
    payroll.overtimePay = overtimePay || payroll.overtimePay;
    payroll.bonuses = bonuses || payroll.bonuses;
    payroll.taxDeductions = taxDeductions || payroll.taxDeductions;
    payroll.insuranceDeductions = insuranceDeductions || payroll.insuranceDeductions;
    payroll.otherDeductions = otherDeductions || payroll.otherDeductions;
    payroll.netPay = netPay || payroll.netPay;
    payroll.status = status || payroll.status;
    payroll.paymentDate = paymentDate || payroll.paymentDate;
    payroll.paymentMethod = paymentMethod || payroll.paymentMethod;
    payroll.accountNumber = accountNumber || payroll.accountNumber;

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
    await payroll.remove();
    res.json({ message: 'Payroll record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 