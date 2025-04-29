const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  month: {
    type: Date,
    required: true
  },
  basicSalary: {
    type: Number,
    required: true,
    min: 0
  },
  overtimePay: {
    type: Number,
    default: 0,
    min: 0
  },
  bonuses: {
    type: Number,
    default: 0,
    min: 0
  },
  taxDeductions: {
    type: Number,
    default: 0,
    min: 0
  },
  insuranceDeductions: {
    type: Number,
    default: 0,
    min: 0
  },
  otherDeductions: {
    type: Number,
    default: 0,
    min: 0
  },
  netPay: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processed'],
    default: 'pending'
  },
  paymentDate: {
    type: Date
  },
  paymentMethod: {
    type: String,
    default: 'Bank Transfer'
  },
  accountNumber: {
    type: String
  }
}, {
  timestamps: true
});

// Pre-save middleware to calculate net pay
payrollSchema.pre('save', function(next) {
  // Calculate total earnings
  const totalEarnings = this.basicSalary + this.overtimePay + this.bonuses;
  
  // Calculate total deductions
  const totalDeductions = this.taxDeductions + this.insuranceDeductions + this.otherDeductions;
  
  // Calculate net pay
  this.netPay = totalEarnings - totalDeductions;
  
  // Validate that net pay is not negative
  if (this.netPay < 0) {
    next(new Error('Net pay cannot be negative'));
  }
  
  next();
});

// Validate that month is not in the future
payrollSchema.pre('save', function(next) {
  const now = new Date();
  if (this.month > now) {
    next(new Error('Payroll month cannot be in the future'));
  }
  next();
});

module.exports = mongoose.model('Payroll', payrollSchema); 