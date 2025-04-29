import React, { useState, useEffect } from "react";
import employeeService from "../services/employeeService";
import { getToken, isAuthenticated, login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../pages/Payroll.css";

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const Payroll = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [payrollData, setPayrollData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editFormData, setEditFormData] = useState({
    salary: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated()) {
        setError("Please log in to access payroll data");
        setLoading(false);
        navigate('/login');
        return;
      }

      try {
        setLoading(true);
        const [employeesData, payrollData] = await Promise.all([
          api.get('/users'),
          api.get(`/payroll?month=${new Date().toISOString()}`)
        ]);

        console.log('Raw employees data:', employeesData.data);

        // Transform the data to match our needs
        const transformedData = employeesData.data.map(emp => {
          console.log('Processing employee:', emp);
          
          // Handle both User and Employee model structures
          const firstName = emp.firstName || (emp.name ? emp.name.split(' ')[0] : '');
          const lastName = emp.lastName || (emp.name ? emp.name.split(' ').slice(1).join(' ') : '');
          
          const fullName = firstName || lastName ? `${firstName} ${lastName}`.trim() : emp.email;
          
          console.log('Processed name:', { firstName, lastName, fullName });
          
          return {
            ...emp,
            fullName: fullName,
            position: emp.position || 'Not specified',
            department: emp.department || 'Not specified',
            salary: emp.salary || 0,
            status: emp.status || 'active'
          };
        });

        console.log('Transformed data:', transformedData);
        setEmployees(transformedData);
        setPayrollData(payrollData.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        if (err.response && err.response.status === 401) {
          setError("Please log in to access payroll data");
          navigate('/login');
        } else {
          setError("Failed to fetch data. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleGeneratePayroll = async () => {
    if (!selectedMonth || !selectedYear) {
      alert("Please select both month and year");
      return;
    }

    try {
      setIsGenerating(true);
      const response = await api.post('/payroll/generate', {
        month: new Date(selectedYear, selectedMonth - 1).toISOString()
      });
      
      setPayrollData(response.data);
      alert("Payroll generated successfully!");
    } catch (err) {
      console.error('Error generating payroll:', err);
      if (err.response && err.response.status === 401) {
        alert("Please log in to generate payroll");
      } else {
        alert("Failed to generate payroll. Please try again.");
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPayroll = async (employeeId) => {
    try {
      const response = await api.get(`/payroll/${employeeId}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `payslip-${employeeId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Error downloading payslip:', err);
      if (err.response && err.response.status === 401) {
        alert("Please log in to download payslip");
      } else {
        alert("Failed to download payslip. Please try again.");
      }
    }
  };

  const handlePrintPayroll = (employeeId) => {
    const payroll = payrollData.find(p => p.employee._id === employeeId);
    if (!payroll) {
      alert("Payroll data not found");
      return;
    }

    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Payslip - ${payroll.employee.name}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .details { margin-bottom: 20px; }
            .section { margin-bottom: 15px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 5px; }
            .total { font-weight: bold; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Payslip</h1>
            <p>${new Date(payroll.month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
          </div>
          <div class="details">
            <p><strong>Employee:</strong> ${payroll.employee.name}</p>
            <p><strong>Department:</strong> ${payroll.employee.department}</p>
            <p><strong>Position:</strong> ${payroll.employee.position}</p>
          </div>
          <div class="section">
            <h3>Earnings</h3>
            <div class="row">
              <span>Basic Salary:</span>
              <span>${formatCurrency(payroll.basicSalary)}</span>
            </div>
            <div class="row">
              <span>Overtime Pay:</span>
              <span>${formatCurrency(payroll.overtimePay)}</span>
            </div>
            <div class="row">
              <span>Bonuses:</span>
              <span>${formatCurrency(payroll.bonuses)}</span>
            </div>
          </div>
          <div class="section">
            <h3>Deductions</h3>
            <div class="row">
              <span>Tax:</span>
              <span>${formatCurrency(payroll.taxDeductions)}</span>
            </div>
            <div class="row">
              <span>Insurance:</span>
              <span>${formatCurrency(payroll.insuranceDeductions)}</span>
            </div>
            <div class="row">
              <span>Other Deductions:</span>
              <span>${formatCurrency(payroll.otherDeductions)}</span>
            </div>
          </div>
          <div class="total">
            <div class="row">
              <span>Net Pay:</span>
              <span>${formatCurrency(payroll.netPay)}</span>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleEditClick = (employee) => {
    setEditingEmployee(employee);
    setEditFormData({
      salary: employee.salary || 0
    });
    setIsEditing(true);
  };

  const handleUpdatePayroll = async () => {
    try {
      // Update the user's salary
      const response = await api.put(`/users/${editingEmployee._id}`, {
        salary: editFormData.salary
      });
      
      const updatedEmployees = employees.map(emp => 
        emp._id === editingEmployee._id ? { ...emp, salary: editFormData.salary } : emp
      );
      setEmployees(updatedEmployees);
      setIsEditing(false);
      setEditingEmployee(null);
      alert("Salary updated successfully!");
    } catch (err) {
      console.error('Error updating salary:', err);
      alert("Failed to update salary. Please try again.");
    }
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesSearch = employee.fullName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus = !selectedStatus || employee.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <div className="loading">Loading employees...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="payroll-container">
      <div className="payroll-header">
        <h1>Payroll Management</h1>
        <div className="payroll-actions">
          <button
            className="generate-btn"
            onClick={handleGeneratePayroll}
            disabled={isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Payroll"}
          </button>
        </div>
      </div>

      <div className="payroll-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by employee name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="">All Months</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
              <option key={month} value={month}>
                {new Date(2000, month - 1).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">All Years</option>
            {Array.from(
              { length: 5 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="on_leave">On Leave</option>
          </select>
        </div>
      </div>

      <div className="payroll-table-container">
        <table className="payroll-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Position</th>
              <th>Department</th>
              <th>Basic Salary</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((employee) => {
              const payroll = payrollData.find(p => p.employee._id === employee._id);
              return (
                <tr key={employee._id}>
                  <td>
                    <div className="employee-info">
                      <span className="name">{employee.name || employee.fullName}</span>
                    </div>
                  </td>
                  <td>{employee.position}</td>
                  <td>{employee.department}</td>
                  <td>{formatCurrency(employee.salary)}</td>
                  <td>
                    <span className={`status-badge ${employee.status}`}>
                      {employee.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleEditClick(employee)}
                        title="Edit"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handleDownloadPayroll(employee._id)}
                        title="Download"
                        disabled={!payroll}
                      >
                        <i className="fas fa-download"></i>
                      </button>
                      <button
                        className="action-btn"
                        onClick={() => handlePrintPayroll(employee._id)}
                        title="Print"
                        disabled={!payroll}
                      >
                        <i className="fas fa-print"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Payroll Modal */}
      {isEditing && (
        <div className="modal">
          <div className="modal-content">
            <h2>Edit Salary</h2>
            <div className="edit-form">
              <div className="form-group">
                <label>Salary</label>
                <input
                  type="number"
                  name="salary"
                  value={editFormData.salary}
                  onChange={handleEditFormChange}
                  placeholder="Enter new salary"
                />
              </div>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button className="update-btn" onClick={handleUpdatePayroll}>
                  Update Salary
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payroll; 