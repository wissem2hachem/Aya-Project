import React from "react";
import Sidebar from "../Components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="dashboard">
      <Sidebar />
      <div className="main-content">{children}</div>

      {/* Shapes */}
      <div className="shapes__one"></div>
      <div className="shapes__two"></div>
      <div className="shapes__three"></div>
    </div>
  );
}
