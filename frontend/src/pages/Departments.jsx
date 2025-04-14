import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import DepartmentForm from './DepartmentForm'; // You'll create this next
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import "../styles/layout.scss";
import './Departments.scss';

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentDepartment, setCurrentDepartment] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  // Mock data - replace with API calls in a real app
  useEffect(() => {
    const mockDepartments = [
      { id: 1, name: 'Human Resources', manager: 'John Doe', employeeCount: 15 },
      { id: 2, name: 'Engineering', manager: 'Jane Smith', employeeCount: 42 },
      { id: 3, name: 'Marketing', manager: 'Mike Johnson', employeeCount: 8 },
      { id: 4, name: 'Finance', manager: 'Sarah Williams', employeeCount: 12 },
    ];
    setDepartments(mockDepartments);
    setFilteredDepartments(mockDepartments);
  }, []);

  useEffect(() => {
    const results = departments.filter(dept =>
      dept.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dept.manager.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDepartments(results);
  }, [searchTerm, departments]);

  const handleAddDepartment = () => {
    setCurrentDepartment(null);
    setIsFormOpen(true);
  };

  const handleEdit = (department) => {
    setCurrentDepartment(department);
    setIsFormOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this department?')) {
      setDepartments(departments.filter(dept => dept.id !== id));
    }
  };

  const handleViewEmployees = (departmentId) => {
    navigate(`/employees?department=${departmentId}`);
  };

  const handleSubmit = (departmentData) => {
    if (currentDepartment) {
      // Update existing department
      setDepartments(departments.map(dept =>
        dept.id === currentDepartment.id ? { ...dept, ...departmentData } : dept
      ));
    } else {
      // Add new department
      const newDepartment = {
        ...departmentData,
        id: Math.max(...departments.map(d => d.id)) + 1,
        employeeCount: 0
      };
      setDepartments([...departments, newDepartment]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="app-layout">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="main-content">
        <div className="departments-page">
          <div className="departments-header">
            <h1>Departments</h1>
            <button className="add-button" onClick={handleAddDepartment}>
              <FiPlus /> Add Department
            </button>
          </div>

          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="departments-grid">
            {filteredDepartments.map((department) => (
              <div key={department.id} className="department-card">
                <div className="department-info">
                  <h3>{department.name}</h3>
                  <p>Manager: {department.manager}</p>
                  <p>Employees: {department.employeeCount}</p>
                </div>
                <div className="department-actions">
                  <button onClick={() => handleEdit(department)}>
                    <FiEdit2 />
                  </button>
                  <button onClick={() => handleDelete(department.id)}>
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Departments;