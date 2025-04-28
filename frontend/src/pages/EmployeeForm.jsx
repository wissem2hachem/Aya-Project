import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiDollarSign, FiCalendar } from "react-icons/fi";
import "./EmployeeForm.scss";

export default function EmployeeForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    department: "",
    position: "",
    salary: "",
    joiningDate: "",
    role: "employee"
  });

  // Fetch departments and employee data if editing
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Authentication token not found");
          return;
        }

        // Fetch departments
        const departmentsResponse = await axios.get("http://localhost:5000/api/departments", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setDepartments(departmentsResponse.data);

        // If editing, fetch employee data
        if (id) {
          const employeeResponse = await axios.get(`http://localhost:5000/api/users/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const employeeData = employeeResponse.data;
          setFormData({
            name: employeeData.name || "",
            email: employeeData.email || "",
            password: "", // Don't pre-fill password
            phone: employeeData.phone || "",
            address: employeeData.address || "",
            department: employeeData.department || "",
            position: employeeData.position || "",
            salary: employeeData.salary || "",
            joiningDate: employeeData.joiningDate ? new Date(employeeData.joiningDate).toISOString().split('T')[0] : "",
            role: employeeData.role || "employee"
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token not found");
        return;
      }

      const userData = {
        ...formData,
        // Only include password if it's not empty (for new users)
        ...(formData.password ? { password: formData.password } : {})
      };

      if (id) {
        // Update existing employee
        await axios.put(`http://localhost:5000/api/users/${id}`, userData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Create new employee
        await axios.post("http://localhost:5000/api/users", userData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      // Show success message
      alert(id ? "Employee updated successfully" : "Employee created successfully");
      navigate("/employees");
    } catch (error) {
      console.error("Error saving employee:", error);
      setError(error.response?.data?.message || "Failed to save employee");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  return (
    <div className="employee-form-page">
      <header className="page-header">
        <h1>{id ? "Edit Employee" : "Add New Employee"}</h1>
      </header>

      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="employee-form">
        <div className="form-section">
          <h2>Personal Information</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">
                <FiUser /> Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FiMail /> Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter email address"
              />
            </div>

            {!id && (
              <div className="form-group">
                <label htmlFor="password">
                  <FiUser /> Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!id}
                  placeholder="Enter password"
                />
              </div>
            )}

            <div className="form-group">
              <label htmlFor="phone">
                <FiPhone /> Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">
                <FiMapPin /> Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
                rows="3"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>Employment Details</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="department">
                <FiBriefcase /> Department
              </label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="position">
                <FiBriefcase /> Position
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                placeholder="Enter position"
              />
            </div>

            <div className="form-group">
              <label htmlFor="salary">
                <FiDollarSign /> Salary
              </label>
              <input
                type="number"
                id="salary"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                required
                placeholder="Enter salary"
              />
            </div>

            <div className="form-group">
              <label htmlFor="joiningDate">
                <FiCalendar /> Joining Date
              </label>
              <input
                type="date"
                id="joiningDate"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">
                <FiUser /> Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="employee">Employee</option>
                <option value="manager">Manager</option>
                <option value="hr">HR</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={() => navigate("/employees")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? "Saving..." : id ? "Update Employee" : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
  );
} 