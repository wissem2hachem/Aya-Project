import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiUser, FiEdit, FiTrash2, FiSearch, FiFilter, FiMail, FiPhone, FiCalendar, FiCheck } from "react-icons/fi";
import "./Employees.scss";

export default function Employees() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departments, setDepartments] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);

  // Fetch employees, departments, and leave requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        console.log("Token:", token);

        if (!token) {
          setError("Authentication token not found");
          return;
        }

        // Fetch employees (users with accounts)
        console.log("Fetching employees...");
        try {
          const employeesResponse = await axios.get("http://localhost:5000/api/users", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log("Raw employees response:", employeesResponse);
          console.log("Employees data:", employeesResponse.data);
          setEmployees(employeesResponse.data);
        } catch (error) {
          console.error("Error fetching employees:", error);
          console.error("Error response:", error.response);
          setError("Failed to fetch employees: " + (error.response?.data?.message || error.message));
        }

        // Fetch departments
        console.log("Fetching departments...");
        try {
          const departmentsResponse = await axios.get("http://localhost:5000/api/departments", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log("Departments response:", departmentsResponse.data);
          setDepartments(departmentsResponse.data);
        } catch (error) {
          console.error("Error fetching departments:", error);
          console.error("Error response:", error.response);
          setError("Failed to fetch departments: " + (error.response?.data?.message || error.message));
        }

        // Fetch leave requests
        console.log("Fetching leave requests...");
        try {
          const leaveRequestsResponse = await axios.get("http://localhost:5000/api/leave-requests", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          console.log("Leave requests response:", leaveRequestsResponse.data);
          setLeaveRequests(leaveRequestsResponse.data);
        } catch (error) {
          console.error("Error fetching leave requests:", error);
          console.error("Error response:", error.response);
          setError("Failed to fetch leave requests: " + (error.response?.data?.message || error.message));
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        setError(error.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle employee deletion
  const handleDelete = async (employeeId) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) {
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      await axios.delete(`http://localhost:5000/api/users/${employeeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Remove the deleted employee from the list
      setEmployees(prevEmployees => 
        prevEmployees.filter(emp => emp._id !== employeeId)
      );

      alert("Employee deleted successfully");
    } catch (error) {
      console.error("Error deleting employee:", error);
      setError(error.response?.data?.message || "Failed to delete employee");
    } finally {
      setLoading(false);
    }
  };

  // Get leave request status for an employee
  const getEmployeeLeaveStatus = (employeeId) => {
    const employeeRequests = leaveRequests.filter(request => 
      request.employeeId._id === employeeId || request.employeeId === employeeId
    );
    
    if (employeeRequests.length === 0) return null;
    
    const pendingRequests = employeeRequests.filter(request => request.status === 'pending');
    const approvedRequests = employeeRequests.filter(request => request.status === 'approved');
    
    return {
      total: employeeRequests.length,
      pending: pendingRequests.length,
      approved: approvedRequests.length
    };
  };

  // Filter employees based on search term and department
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.position?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = !selectedDepartment || employee.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  console.log("Current employees state:", employees);
  console.log("Filtered employees:", filteredEmployees);

  if (loading) {
    return <div className="loading-message">Loading employees...</div>;
  }

  return (
    <div className="employees-page">
      <header className="page-header">
        <h1>Employees</h1>
      </header>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="filters-section">
        <div className="search-container">
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-container">
          <FiFilter className="filter-icon" />
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
            className="department-filter"
          >
            <option value="">All Departments</option>
            {departments.map(dept => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="employees-grid">
        {filteredEmployees.length === 0 ? (
          <div className="empty-state">
            <p>No employees found</p>
          </div>
        ) : (
          filteredEmployees.map(employee => {
            const leaveStatus = getEmployeeLeaveStatus(employee._id);
            console.log("Rendering employee:", employee);
            
            return (
              <div key={employee._id} className="employee-card">
                <div className="employee-header">
                  <img 
                    src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.name?.replace(' ', '+')}&background=3498db&color=fff`}
                    alt={employee.name || 'Employee'}
                    className="employee-avatar"
                  />
                  <div className="employee-info">
                    <h3>{employee.name || 'Unnamed Employee'}</h3>
                    <p className="employee-position">{employee.position || 'No Position'}</p>
                    <p className="employee-department">
                      {departments.find(dept => dept._id === employee.department)?.name || 'No Department'}
                    </p>
                  </div>
                </div>

                <div className="employee-details">
                  <div className="detail-item">
                    <FiUser className="icon" />
                    <span>{employee.role || 'No Role'}</span>
                  </div>
                  <div className="detail-item">
                    <FiMail className="icon" />
                    <span>{employee.email || 'No Email'}</span>
                  </div>
                  {employee.phone && (
                    <div className="detail-item">
                      <FiPhone className="icon" />
                      <span>{employee.phone}</span>
                    </div>
                  )}
                  {leaveStatus && (
                    <div className="detail-item leave-status">
                      <FiCalendar className="icon" />
                      <span>
                        {leaveStatus.pending > 0 ? `${leaveStatus.pending} pending` : ''}
                        {leaveStatus.pending > 0 && leaveStatus.approved > 0 ? ' • ' : ''}
                        {leaveStatus.approved > 0 ? `${leaveStatus.approved} approved` : ''}
                      </span>
                    </div>
                  )}
                  {employee.profileCompletion && (
                    <div className="detail-item profile-completion">
                      <FiCheck className="icon" />
                      <span>Profile {employee.profileCompletion}% Complete</span>
                    </div>
                  )}
                </div>

                <div className="employee-actions">
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/employees/${employee._id}`)}
                  >
                    <FiEdit /> Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(employee._id)}
                  >
                    <FiTrash2 /> Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
