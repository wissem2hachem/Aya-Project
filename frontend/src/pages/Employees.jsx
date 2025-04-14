import React, { useState } from "react";
import { FiPlus, FiSearch, FiEdit2, FiTrash2 } from "react-icons/fi";
import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import "../styles/layout.scss";
import "./Employees.scss";

export default function Employees() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const employees = [
    { id: 1, name: "Ali Ben Salah", age: 28, occupation: "Software Engineer", department: "IT" },
    { id: 2, name: "Sarah Johnson", age: 32, occupation: "HR Manager", department: "Human Resources" },
    { id: 3, name: "Michael Brown", age: 45, occupation: "Project Manager", department: "Management" },
    { id: 4, name: "Emily Davis", age: 26, occupation: "Marketing Specialist", department: "Marketing" },
    { id: 5, name: "David Wilson", age: 38, occupation: "Financial Analyst", department: "Finance" }
  ];

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="app-layout">
      <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <main className="main-content">
        <div className="employees-page">
          <div className="page-header">
            <h1>Employees</h1>
            <div className="actions">
              <div className="search-container">
                <FiSearch />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="add-button">
                <FiPlus />
                Add Employee
              </button>
            </div>
          </div>

          <div className="employee-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Occupation</th>
                  <th>Department</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id}>
                    <td>{employee.name}</td>
                    <td>{employee.age}</td>
                    <td>{employee.occupation}</td>
                    <td>{employee.department}</td>
                    <td>
                      <div className="employee-actions">
                        <button className="edit">
                          <FiEdit2 />
                        </button>
                        <button className="delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
