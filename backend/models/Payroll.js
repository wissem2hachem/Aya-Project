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
    required: true
  },
  overtimePay: {
    type: Number,
    default: 0
  },
  bonuses: {
    type: Number,
    default: 0
  },
  taxDeductions: {
    type: Number,
    default: 0
  },
  insuranceDeductions: {
    type: Number,
    default: 0
  },
  otherDeductions: {
    type: Number,
    default: 0
  },
  netPay: {
    type: Number,
    required: true
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

module.exports = mongoose.model('Payroll', payrollSchema); 