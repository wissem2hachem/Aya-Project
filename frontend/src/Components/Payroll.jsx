import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiCalendar, FiDownload, FiFilter, FiSearch, FiPlus } from 'react-icons/fi';
import axios from 'axios';
import '../styles/Payroll.scss';

const Payroll = () => {
  const [payrollData, setPayrollData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(null);

  // Fetch payroll data
  useEffect(() => {
    const fetchPayrollData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:5000/api/payroll?month=${selectedMonth.toISOString()}`);
        setPayrollData(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch payroll data');
        console.error('Error fetching payroll data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPayrollData();
  }, [selectedMonth]);

  // Calculate payroll statistics
  const calculateStats = () => {
    const totalPaid = payrollData
      .filter(record => record.status === 'processed')
      .reduce((sum, record) => sum + record.netPay, 0);

    const totalPending = payrollData
      .filter(record => record.status === 'pending')
      .reduce((sum, record) => sum + record.netPay, 0);

    const totalEmployees = payrollData.length;
    const processedEmployees = payrollData.filter(record => record.status === 'processed').length;

    return {
      totalPaid,
      totalPending,
      totalEmployees,
      processedEmployees
    };
  };

  const stats = calculateStats();

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  // Handle month navigation
  const handleMonthChange = (direction) => {
    const newDate = new Date(selectedMonth);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedMonth(newDate);
  };

  // Filter payroll data
  const filteredData = payrollData.filter(record => {
    const searchLower = searchTerm.toLowerCase();
    return (
      record.employee.name.toLowerCase().includes(searchLower) ||
      record.employee.department.toLowerCase().includes(searchLower) ||
      record.employee.position.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="payroll-container">
      <div className="payroll-header">
        <h1>Payroll Management</h1>
        <div className="header-actions">
          <button className="add-button" onClick={() => setShowAddModal(true)}>
            <FiPlus /> Add Payroll
          </button>
        </div>
      </div>

      <div className="payroll-stats">
        <div className="stat-card">
          <div className="stat-icon">
            <FiDollarSign />
          </div>
          <div className="stat-content">
            <h3>Total Paid</h3>
            <p>{formatCurrency(stats.totalPaid)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiCalendar />
          </div>
          <div className="stat-content">
            <h3>Pending Payments</h3>
            <p>{formatCurrency(stats.totalPending)}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FiDownload />
          </div>
          <div className="stat-content">
            <h3>Processed Payslips</h3>
            <p>{stats.processedEmployees} / {stats.totalEmployees}</p>
          </div>
        </div>
      </div>

      <div className="payroll-controls">
        <div className="month-navigator">
          <button onClick={() => handleMonthChange(-1)}>Previous</button>
          <span>{formatDate(selectedMonth)}</span>
          <button onClick={() => handleMonthChange(1)}>Next</button>
        </div>
        <div className="search-filter">
          <div className="search-box">
            <FiSearch />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="filter-button">
            <FiFilter /> Filter
          </button>
        </div>
      </div>

      <div className="payroll-table">
        <table>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Position</th>
              <th>Basic Salary</th>
              <th>Overtime</th>
              <th>Deductions</th>
              <th>Net Pay</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((record) => (
              <tr key={record._id}>
                <td>
                  <div className="employee-info">
                    <span className="name">{record.employee.name}</span>
                    <span className="id">{record.employee._id}</span>
                  </div>
                </td>
                <td>{record.employee.department}</td>
                <td>{record.employee.position}</td>
                <td>{formatCurrency(record.basicSalary)}</td>
                <td>{formatCurrency(record.overtimePay)}</td>
                <td>{formatCurrency(record.taxDeductions + record.insuranceDeductions + record.otherDeductions)}</td>
                <td className="net-pay">{formatCurrency(record.netPay)}</td>
                <td>
                  <span className={`status-badge ${record.status}`}>
                    {record.status}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="view-button"
                      onClick={() => setShowDetailsModal(record)}
                    >
                      View
                    </button>
                    <button className="download-button">
                      <FiDownload />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Payroll Modal */}
      {showAddModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Add New Payroll</h2>
            {/* Add payroll form will go here */}
            <button onClick={() => setShowAddModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Payroll Details Modal */}
      {showDetailsModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Payroll Details</h2>
            <div className="payslip-details">
              <div className="employee-info">
                <h3>{showDetailsModal.employee.name}</h3>
                <p>{showDetailsModal.employee.position} • {showDetailsModal.employee.department}</p>
              </div>
              <div className="earnings">
                <h4>Earnings</h4>
                <div className="detail-row">
                  <span>Basic Salary</span>
                  <span>{formatCurrency(showDetailsModal.basicSalary)}</span>
                </div>
                <div className="detail-row">
                  <span>Overtime Pay</span>
                  <span>{formatCurrency(showDetailsModal.overtimePay)}</span>
                </div>
                <div className="detail-row">
                  <span>Bonuses</span>
                  <span>{formatCurrency(showDetailsModal.bonuses)}</span>
                </div>
              </div>
              <div className="deductions">
                <h4>Deductions</h4>
                <div className="detail-row">
                  <span>Tax</span>
                  <span>{formatCurrency(showDetailsModal.taxDeductions)}</span>
                </div>
                <div className="detail-row">
                  <span>Insurance</span>
                  <span>{formatCurrency(showDetailsModal.insuranceDeductions)}</span>
                </div>
                <div className="detail-row">
                  <span>Other Deductions</span>
                  <span>{formatCurrency(showDetailsModal.otherDeductions)}</span>
                </div>
              </div>
              <div className="net-pay">
                <h4>Net Pay</h4>
                <span>{formatCurrency(showDetailsModal.netPay)}</span>
              </div>
            </div>
            <button onClick={() => setShowDetailsModal(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll; 