import React from "react";
import './Employees.scss'; 

export default function Employees() {
  const employees = [
    { id: 1, name: "Ali Ben Salah", age: 28, occupation: "Software Engineer", department: "IT" },
    { id: 2, name: "Yasmine Trabelsi", age: 32, occupation: "HR Specialist", department: "Human Resources" },
    { id: 3, name: "Khalil Chaabane", age: 25, occupation: "UI/UX Designer", department: "Design" },
    { id: 4, name: "Sana Jaziri", age: 30, occupation: "Project Manager", department: "Operations" },
    { id: 5, name: "Hatem Gharbi", age: 35, occupation: "Finance Analyst", department: "Finance" },
  ];

  return (
    <div className="employees-page">
      <h1>Employees</h1>
      <table className="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Occupation</th>
            <th>Department</th>
          </tr>
        </thead>
        <tbody>
          {employees.map(emp => (
            <tr key={emp.id}>
              <td>{emp.id}</td>
              <td>{emp.name}</td>
              <td>{emp.age}</td>
              <td>{emp.occupation}</td>
              <td>{emp.department}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
