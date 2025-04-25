import React, { useState, useEffect } from "react";
import { 
  FiSearch, 
  FiFilter, 
  FiPlus, 
  FiCalendar, 
  FiCheck, 
  FiX,
  FiClock,
  FiEye,
  FiSave
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import axios from 'axios';
import "./LeaveRequests.scss";

// Add axios instance configuration
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default function LeaveRequests() {
  const { userRole, currentUser, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isNewRequestOpen, setIsNewRequestOpen] = useState(false);
  const [showRequestDetails, setShowRequestDetails] = useState(null);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New request form data
  const [newRequest, setNewRequest] = useState({
    type: "Annual Leave",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // Form validation errors
  const [formErrors, setFormErrors] = useState({});

  // Fetch leave requests from backend
  useEffect(() => {
    const fetchLeaveRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!currentUser) {
          setError('Please log in to view leave requests');
          setLoading(false);
          return;
        }

        // Use different endpoints based on user role
        const endpoint = hasPermission(['admin', 'hr', 'manager']) 
          ? '/api/leave-requests'  // Get all requests for managers/admins
          : '/api/leave-requests/my-requests';  // Get only user's requests for regular employees

        const response = await api.get(endpoint);
        setLeaveRequests(response.data);
      } catch (err) {
        console.error('Error fetching leave requests:', err);
        if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch leave requests');
        }
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchLeaveRequests();
    }
  }, [currentUser, hasPermission]);

  // Function to submit new leave request
  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      setError('Please log in to submit a leave request');
      return;
    }
    
    const isValid = validateForm();
    
    if (isValid) {
      setIsSubmitting(true);
      setError(null);
      setFormErrors({});
      
      try {
        const requestData = {
          type: newRequest.type,
          startDate: newRequest.startDate,
          endDate: newRequest.endDate,
          reason: newRequest.reason.trim()
        };
        
        console.log('Submitting leave request:', requestData);
        const response = await api.post('/api/leave-requests', requestData);
        console.log('Server response:', response.data);
        
        // Update the leave requests list with the new request
        setLeaveRequests(prevRequests => [response.data, ...prevRequests]);
        setSuccessMessage(`Leave request for ${newRequest.type} has been submitted successfully`);
        setIsNewRequestOpen(false);
        setNewRequest({
          type: "Annual Leave",
          startDate: "",
          endDate: "",
          reason: "",
        });
      } catch (err) {
        console.error('Error submitting leave request:', err.response || err);
        
        // Handle validation errors from the server
        if (err.response?.data?.details) {
          setFormErrors(err.response.data.details);
          setError('Please correct the errors in the form');
        } else if (err.response?.status === 401) {
          setError('Your session has expired. Please log in again.');
        } else {
          setError(err.response?.data?.message || 'Failed to submit leave request. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Function to handle status changes
  const handleStatusChange = async (id, newStatus) => {
    if (!hasPermission(['admin', 'hr', 'manager'])) return;
    
    try {
      setError(null);
      const response = await api.patch(`/api/leave-requests/${id}/status`, { status: newStatus });
      
      setLeaveRequests(prevRequests =>
        prevRequests.map(request =>
          request._id === id ? response.data : request
        )
      );
      setShowRequestDetails(null);
      setSuccessMessage('Leave request status updated successfully');
    } catch (err) {
      console.error('Error updating leave request status:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to update leave request status');
      }
    }
  };

  // Function to delete leave request
  const handleDeleteRequest = async (id) => {
    try {
      setError(null);
      await api.delete(`/api/leave-requests/${id}`);
      
      setLeaveRequests(prevRequests =>
        prevRequests.filter(request => request._id !== id)
      );
      setSuccessMessage('Leave request deleted successfully');
    } catch (err) {
      console.error('Error deleting leave request:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to delete leave request');
      }
    }
  };

  // Filter leave requests based on search, status filter, and user role
  const filteredRequests = leaveRequests.filter(request => {
    // Role-based filtering:
    // - If user is admin, HR, or manager: show all requests
    // - If user is a regular employee: only show their own requests
    if (!hasPermission(['admin', 'hr', 'manager'])) {
      // Regular employee - only show their own requests
      if (!currentUser?._id) {
        return false;
      }
      // Convert both IDs to strings and compare
      const requestId = String(request.employeeId).trim();
      const currentUserId = String(currentUser._id).trim();
      
      if (requestId !== currentUserId) {
        return false;
      }
    }
    
    // Apply search filter
    const matchesSearch = 
      (request.employeeName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (request.type?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (request.department?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    // Apply status filter
    const matchesFilter = 
      filterStatus === "all" || request.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to get status badge color
  const getStatusInfo = (status) => {
    switch(status) {
      case "approved":
        return { color: "#22c55e", icon: <FiCheck /> };
      case "rejected":
        return { color: "#ef4444", icon: <FiX /> };
      case "pending":
        return { color: "#f59e0b", icon: <FiClock /> };
      default:
        return { color: "#9ca3af", icon: null };
    }
  };

  // Function to handle filter status change
  const handleFilterChange = (status) => {
    setFilterStatus(status);
    setIsFilterDropdownOpen(false);
  };

  // Function to handle new request form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value);
    setNewRequest(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to validate form
  const validateForm = () => {
    console.log('Validating form with data:', newRequest);
    const errors = {};
    
    if (!newRequest.type.trim()) {
      errors.type = "Leave type is required";
    }
    
    if (!newRequest.startDate) {
      errors.startDate = "Start date is required";
    } else {
      const startDate = new Date(newRequest.startDate);
      if (isNaN(startDate.getTime())) {
        errors.startDate = "Invalid start date";
      }
    }
    
    if (!newRequest.endDate) {
      errors.endDate = "End date is required";
    } else {
      const endDate = new Date(newRequest.endDate);
      if (isNaN(endDate.getTime())) {
        errors.endDate = "Invalid end date";
      }
    }
    
    if (newRequest.startDate && newRequest.endDate) {
      const startDate = new Date(newRequest.startDate);
      const endDate = new Date(newRequest.endDate);
      if (startDate > endDate) {
        errors.endDate = "End date must be after start date";
      }
    }
    
    if (!newRequest.reason.trim()) {
      errors.reason = "Reason is required";
    }
    
    console.log('Validation errors:', errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Add a function to get all requests for the current user
  const getUserRequests = () => {
    if (!currentUser?.employeeId) return [];
    return leaveRequests.filter(request => 
      String(request.employeeId) === String(currentUser.employeeId)
    );
  };

  // Add a summary of the user's requests
  const userRequests = getUserRequests();
  const pendingCount = userRequests.filter(r => r.status === "pending").length;
  const approvedCount = userRequests.filter(r => r.status === "approved").length;
  const rejectedCount = userRequests.filter(r => r.status === "rejected").length;

  // Add debug logging
  useEffect(() => {
    console.log('Current User:', currentUser);
    console.log('Leave Requests:', leaveRequests);
    console.log('Filtered Requests:', filteredRequests);
  }, [currentUser, leaveRequests, filteredRequests]);

  return (
    <div className="leave-requests-page">
      <header className="page-header">
        {hasPermission(['admin', 'hr', 'manager']) ? (
          <h1>Leave Requests</h1>
        ) : (
          <h1>My Leave Requests</h1>
        )}
        
        {/* Leave summary counter - only for HR/admin/manager */}
        {hasPermission(['admin', 'hr', 'manager']) && (
          <div className="leave-summary">
            <div className="summary-item">
              <h3>Pending</h3>
              <p>{leaveRequests.filter(r => r.status === "pending").length}</p>
            </div>
            <div className="summary-item">
              <h3>Approved</h3>
              <p>{leaveRequests.filter(r => r.status === "approved").length}</p>
            </div>
            <div className="summary-item">
              <h3>Rejected</h3>
              <p>{leaveRequests.filter(r => r.status === "rejected").length}</p>
            </div>
          </div>
        )}

        {/* Display a summary for regular employees */}
        {!hasPermission(['admin', 'hr', 'manager']) && (
          <div className="my-leave-summary">
            <div className="summary-item">
              <h3>Pending</h3>
              <p>{pendingCount}</p>
            </div>
            <div className="summary-item">
              <h3>Approved</h3>
              <p>{approvedCount}</p>
            </div>
            <div className="summary-item">
              <h3>Rejected</h3>
              <p>{rejectedCount}</p>
            </div>
          </div>
        )}
      </header>

      {successMessage && (
        <div className="success-message">
          <FiCheck className="success-icon" />
          <p>{successMessage}</p>
        </div>
      )}

      <div className="actions-bar">
        <div className="search-container">
          <FiSearch />
          <input
            type="text"
            placeholder={
              hasPermission(['admin', 'hr', 'manager']) 
                ? "Search employee, leave type..." 
                : "Search by leave type..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="action-buttons">
          <div className="filter-dropdown">
            <button 
              className="filter-button"
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            >
              <FiFilter />
              <span>Filter</span>
            </button>
            <div className="dropdown-content" style={{ display: isFilterDropdownOpen ? 'block' : 'none' }}>
              <button 
                className={filterStatus === "all" ? "active" : ""} 
                onClick={() => handleFilterChange("all")}
              >
                All Requests
              </button>
              <button 
                className={filterStatus === "pending" ? "active" : ""} 
                onClick={() => handleFilterChange("pending")}
              >
                Pending
              </button>
              <button 
                className={filterStatus === "approved" ? "active" : ""} 
                onClick={() => handleFilterChange("approved")}
              >
                Approved
              </button>
              <button 
                className={filterStatus === "rejected" ? "active" : ""} 
                onClick={() => handleFilterChange("rejected")}
              >
                Rejected
              </button>
            </div>
          </div>
          
          <button className="new-request-button" onClick={() => setIsNewRequestOpen(true)}>
            <FiPlus />
            <span>New Request</span>
          </button>
        </div>
      </div>

      <div className="leave-table">
        <table>
          <thead>
            <tr>
              {hasPermission(['admin', 'hr', 'manager']) && <th>Employee</th>}
              <th>Department</th>
              <th>Type</th>
              <th>Duration</th>
              <th>Date Range</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => {
                const statusInfo = getStatusInfo(request.status);
                
                return (
                  <tr key={request.id}>
                    {hasPermission(['admin', 'hr', 'manager']) && <td>{request.employeeName}</td>}
                    <td>{request.department}</td>
                    <td>{request.type}</td>
                    <td>{request.duration}</td>
                    <td>
                      <div className="date-range">
                        <FiCalendar className="icon" />
                        <span>{formatDate(request.startDate)} - {formatDate(request.endDate)}</span>
                      </div>
                    </td>
                    <td>
                      <div className="status-cell">
                        <span 
                          className="status-badge" 
                          style={{ backgroundColor: statusInfo.color }}
                        >
                          {statusInfo.icon}
                        </span>
                        <span className="status-text">{request.status}</span>
                      </div>
                    </td>
                    <td>
                      <div className="request-actions">
                        <button className="view-button" onClick={() => setShowRequestDetails(request)}>
                          <FiEye />
                        </button>
                        {request.status === "pending" && hasPermission(['admin', 'hr', 'manager']) && (
                          <>
                            <button 
                              className="approve-button" 
                              onClick={() => handleStatusChange(request.id, "approved")}
                            >
                              <FiCheck />
                            </button>
                            <button 
                              className="reject-button" 
                              onClick={() => {
                                const reason = window.prompt("Reason for rejection:");
                                if (reason) handleStatusChange(request.id, "rejected", reason);
                              }}
                            >
                              <FiX />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={hasPermission(['admin', 'hr', 'manager']) ? 7 : 6} className="no-requests">
                  No leave requests found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Request Modal */}
      {isNewRequestOpen && (
        <div className="request-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>New Leave Request</h3>
              <button className="close-button" onClick={() => setIsNewRequestOpen(false)}>
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmitRequest}>
              <div className="modal-body">
                {/* For admins and HR, show editable employee fields */}
                {hasPermission(['admin', 'hr']) ? (
                  <>
                    <div className="form-group">
                      <label htmlFor="employeeName">Employee Name</label>
                      <input
                        type="text"
                        id="employeeName"
                        name="employeeName"
                        value={newRequest.employeeName}
                        onChange={handleInputChange}
                        className={formErrors.employeeName ? "error" : ""}
                      />
                      {formErrors.employeeName && <div className="error-message">{formErrors.employeeName}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="employeeId">Employee ID</label>
                      <input
                        type="text"
                        id="employeeId"
                        name="employeeId"
                        value={newRequest.employeeId}
                        onChange={handleInputChange}
                        className={formErrors.employeeId ? "error" : ""}
                      />
                      {formErrors.employeeId && <div className="error-message">{formErrors.employeeId}</div>}
                    </div>
                    
                    <div className="form-group">
                      <label htmlFor="department">Department</label>
                      <select
                        id="department"
                        name="department"
                        value={newRequest.department}
                        onChange={handleInputChange}
                        className={formErrors.department ? "error" : ""}
                      >
                        <option value="">Select Department</option>
                        <option value="IT">IT</option>
                        <option value="Human Resources">Human Resources</option>
                        <option value="Management">Management</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Finance">Finance</option>
                        <option value="General">General</option>
                      </select>
                      {formErrors.department && <div className="error-message">{formErrors.department}</div>}
                    </div>
                  </>
                ) : (
                  // For regular employees, show a simple summary of their info
                  <div className="employee-info-summary">
                    <p>You are submitting this request as:</p>
                    <div className="info-box">
                      <strong>{currentUser?.name || "Employee"}</strong>
                      <span>ID: {currentUser?.employeeId || "Not assigned"}</span>
                      <span>Department: {currentUser?.department || "General"}</span>
                    </div>
                  </div>
                )}
                
                <div className="form-group">
                  <label htmlFor="type">Leave Type</label>
                  <select
                    id="type"
                    name="type"
                    value={newRequest.type}
                    onChange={handleInputChange}
                    className={formErrors.type ? "error" : ""}
                  >
                    <option value="Annual Leave">Annual Leave</option>
                    <option value="Sick Leave">Sick Leave</option>
                    <option value="Personal Leave">Personal Leave</option>
                    <option value="Maternity Leave">Maternity Leave</option>
                    <option value="Paternity Leave">Paternity Leave</option>
                    <option value="Unpaid Leave">Unpaid Leave</option>
                  </select>
                  {formErrors.type && <div className="error-message">{formErrors.type}</div>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={newRequest.startDate}
                      onChange={handleInputChange}
                      className={formErrors.startDate ? "error" : ""}
                    />
                    {formErrors.startDate && <div className="error-message">{formErrors.startDate}</div>}
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                      type="date"
                      id="endDate"
                      name="endDate"
                      value={newRequest.endDate}
                      onChange={handleInputChange}
                      className={formErrors.endDate ? "error" : ""}
                    />
                    {formErrors.endDate && <div className="error-message">{formErrors.endDate}</div>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="reason">Reason</label>
                  <textarea
                    id="reason"
                    name="reason"
                    value={newRequest.reason}
                    onChange={handleInputChange}
                    rows="4"
                    className={formErrors.reason ? "error" : ""}
                  ></textarea>
                  {formErrors.reason && <div className="error-message">{formErrors.reason}</div>}
                </div>
              </div>
              
              <div className="modal-footer">
                <button type="button" className="cancel-btn" onClick={() => setIsNewRequestOpen(false)} disabled={isSubmitting}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FiSave />
                      Submit Request
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {showRequestDetails && (
        <div className="request-details-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Leave Request Details</h3>
              <button className="close-button" onClick={() => setShowRequestDetails(null)}>
                <FiX />
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="label">Employee:</span>
                <span className="value">{showRequestDetails.employeeName} ({showRequestDetails.employeeId})</span>
              </div>
              <div className="detail-row">
                <span className="label">Department:</span>
                <span className="value">{showRequestDetails.department}</span>
              </div>
              <div className="detail-row">
                <span className="label">Leave Type:</span>
                <span className="value">{showRequestDetails.type}</span>
              </div>
              <div className="detail-row">
                <span className="label">Duration:</span>
                <span className="value">{showRequestDetails.duration}</span>
              </div>
              <div className="detail-row">
                <span className="label">From:</span>
                <span className="value">{formatDate(showRequestDetails.startDate)}</span>
              </div>
              <div className="detail-row">
                <span className="label">To:</span>
                <span className="value">{formatDate(showRequestDetails.endDate)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Reason:</span>
                <span className="value">{showRequestDetails.reason}</span>
              </div>
              <div className="detail-row">
                <span className="label">Submitted On:</span>
                <span className="value">{formatDate(showRequestDetails.submitDate)}</span>
              </div>
              <div className="detail-row">
                <span className="label">Status:</span>
                <span className={`value status-${showRequestDetails.status}`}>
                  {showRequestDetails.status.charAt(0).toUpperCase() + showRequestDetails.status.slice(1)}
                </span>
              </div>
              
              {showRequestDetails.approver && (
                <div className="detail-row">
                  <span className="label">Processed By:</span>
                  <span className="value">{showRequestDetails.approver}</span>
                </div>
              )}
              
              {showRequestDetails.approvedDate && (
                <div className="detail-row">
                  <span className="label">Processed On:</span>
                  <span className="value">{formatDate(showRequestDetails.approvedDate)}</span>
                </div>
              )}
              
              {showRequestDetails.rejectionReason && (
                <div className="detail-row">
                  <span className="label">Rejection Reason:</span>
                  <span className="value rejection-reason">{showRequestDetails.rejectionReason}</span>
                </div>
              )}
            </div>
            
            {showRequestDetails.status === "pending" && hasPermission(['admin', 'hr', 'manager']) && (
              <div className="modal-footer">
                <button 
                  className="approve-btn" 
                  onClick={() => handleStatusChange(showRequestDetails.id, "approved")}
                >
                  Approve Request
                </button>
                <button 
                  className="reject-btn" 
                  onClick={() => {
                    const reason = window.prompt("Reason for rejection:");
                    if (reason) handleStatusChange(showRequestDetails.id, "rejected", reason);
                  }}
                >
                  Reject Request
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 