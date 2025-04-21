import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import EmployeeSidebar from './EmployeeSidebar';
import '../styles/layout.scss';

export default function EmployeeLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="app-layout employee-layout">
      <Navbar 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        userRole="employee"
      />
      <EmployeeSidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
} 